import pandas as pd


def detect_anomalies(df: pd.DataFrame) -> dict:
    """
    Detect unusual business patterns in datasets
    that do not contain time-series information.

    Current detection methods:

    1. Product revenue outliers
    2. Product revenue concentration
    3. High-volume / low-revenue products
    4. Regional revenue concentration
    5. Regional revenue imbalance
    """

    anomalies = []

    df = df.copy()

    # =========================================================
    # CREATE REVENUE
    # =========================================================

    if not {"price", "quantity"}.issubset(df.columns):

        return {
            "anomalies": [],
            "count": 0,
            "status": "insufficient_data"
        }

    df["revenue"] = (
        df["price"] * df["quantity"]
    )

    total_revenue = float(
        df["revenue"].sum()
    )

    if total_revenue <= 0:

        return {
            "anomalies": [],
            "count": 0,
            "status": "insufficient_data"
        }

    # =========================================================
    # PRODUCT ANALYSIS
    # =========================================================

    if "product" in df.columns:

        products = (
            df.groupby("product")
            .agg(
                revenue=("revenue", "sum"),
                units_sold=("quantity", "sum")
            )
            .sort_values(
                "revenue",
                ascending=False
            )
        )

        # -----------------------------------------------------
        # PRODUCT REVENUE OUTLIER
        # -----------------------------------------------------

        if len(products) >= 3:

            median_revenue = float(
                products["revenue"].median()
            )

            if median_revenue > 0:

                for product, row in products.iterrows():

                    revenue = float(
                        row["revenue"]
                    )

                    ratio = (
                        revenue /
                        median_revenue
                    )

                    if ratio >= 3:

                        revenue_share = (
                            revenue /
                            total_revenue *
                            100
                        )

                        anomalies.append({
                            "type": "product_revenue_outlier",

                            "severity": "high",

                            "title": "Product revenue outlier",

                            "entity": str(product),

                            "message": (
                                f"{product} generates "
                                f"€{revenue:,.2f}, which is "
                                f"{ratio:.1f}× the median "
                                f"product revenue."
                            ),

                            "metric": round(
                                revenue,
                                2
                            ),

                            "impact": round(
                                revenue_share,
                                1
                            )
                        })

        # -----------------------------------------------------
        # PRODUCT CONCENTRATION
        # -----------------------------------------------------

        if len(products) >= 2:

            top_two_revenue = float(
                products.head(2)["revenue"].sum()
            )

            top_two_share = (
                top_two_revenue /
                total_revenue *
                100
            )

            if top_two_share >= 80:

                anomalies.append({
                    "type": "product_concentration",

                    "severity": "high",

                    "title": "High product concentration",

                    "entity": "Top 2 products",

                    "message": (
                        f"The top two products generate "
                        f"{top_two_share:.1f}% of total revenue. "
                        f"A disruption to these products "
                        f"could significantly affect revenue."
                    ),

                    "metric": round(
                        top_two_share,
                        1
                    ),

                    "impact": round(
                        top_two_share,
                        1
                    )
                })

        # -----------------------------------------------------
        # HIGH VOLUME / LOW REVENUE
        # -----------------------------------------------------

        if len(products) >= 2:

            max_units = products[
                "units_sold"
            ].max()

            highest_volume_products = (
                products[
                    products["units_sold"]
                    == max_units
                ]
            )

            for product, row in (
                highest_volume_products.iterrows()
            ):

                revenue_share = (
                    float(row["revenue"]) /
                    total_revenue *
                    100
                )

                if revenue_share <= 10:

                    anomalies.append({
                        "type": "volume_revenue_mismatch",

                        "severity": "medium",

                        "title": "Volume vs revenue mismatch",

                        "entity": str(product),

                        "message": (
                            f"{product} has the highest "
                            f"unit volume but contributes only "
                            f"{revenue_share:.1f}% of total revenue."
                        ),

                        "metric": int(
                            row["units_sold"]
                        ),

                        "impact": round(
                            revenue_share,
                            1
                        )
                    })

    # =========================================================
    # REGION ANALYSIS
    # =========================================================

    if "region" in df.columns:

        regions = (
            df.groupby("region")
            .agg(
                revenue=("revenue", "sum"),
                units_sold=("quantity", "sum")
            )
            .sort_values(
                "revenue",
                ascending=False
            )
        )

        # -----------------------------------------------------
        # REGIONAL CONCENTRATION
        # -----------------------------------------------------

        if len(regions) >= 2:

            top_region = regions.iloc[0]

            top_region_name = (
                str(regions.index[0])
            )

            top_region_revenue = float(
                top_region["revenue"]
            )

            top_region_share = (
                top_region_revenue /
                total_revenue *
                100
            )

            if top_region_share >= 50:

                anomalies.append({
                    "type": "regional_concentration",

                    "severity": "high",

                    "title": "Regional dependency",

                    "entity": top_region_name,

                    "message": (
                        f"{top_region_name} generates "
                        f"{top_region_share:.1f}% of total revenue. "
                        f"The business may be highly dependent "
                        f"on this market."
                    ),

                    "metric": round(
                        top_region_share,
                        1
                    ),

                    "impact": round(
                        top_region_share,
                        1
                    )
                })

        # -----------------------------------------------------
        # REGIONAL IMBALANCE
        # -----------------------------------------------------

        if len(regions) >= 3:

            median_region_revenue = float(
                regions["revenue"].median()
            )

            if median_region_revenue > 0:

                top_region = regions.iloc[0]

                ratio = (
                    float(top_region["revenue"]) /
                    median_region_revenue
                )

                if ratio >= 3:

                    anomalies.append({
                        "type": "regional_outlier",

                        "severity": "medium",

                        "title": "Regional performance outlier",

                        "entity": str(
                            regions.index[0]
                        ),

                        "message": (
                            f"{regions.index[0]} generates "
                            f"{ratio:.1f}× the median regional "
                            f"revenue."
                        ),

                        "metric": round(
                            float(
                                top_region["revenue"]
                            ),
                            2
                        ),

                        "impact": round(
                            ratio,
                            1
                        )
                    })

    # =========================================================
    # SORT BY SEVERITY
    # =========================================================

    severity_order = {
        "high": 0,
        "medium": 1,
        "low": 2
    }

    anomalies.sort(
        key=lambda x:
        severity_order.get(
            x["severity"],
            3
        )
    )

    # =========================================================
    # RETURN RESULT
    # =========================================================

    return {
        "anomalies": anomalies,

        "count": len(anomalies),

        "status": (
            "anomalies_detected"
            if anomalies
            else "no_anomalies"
        )
    }