import pandas as pd


def calculate_analytics(df: pd.DataFrame) -> dict:
    """
    Perform deeper business analytics on a sales dataset.

    This layer calculates measurable business signals.
    AI will later explain these signals in natural language.
    """

    analytics = {}

    df = df.copy()

    # =========================================================
    # CREATE REVENUE
    # =========================================================

    if {"price", "quantity"}.issubset(df.columns):

        df["revenue"] = (
            df["price"] * df["quantity"]
        )

    else:

        analytics["insights"] = [
            "The dataset does not contain both price and quantity columns, so revenue analysis could not be performed."
        ]

        return analytics

    # =========================================================
    # BASIC DATASET METRICS
    # =========================================================

    total_revenue = float(
        df["revenue"].sum()
    )

    total_units = int(
        df["quantity"].sum()
    )

    analytics["summary"] = {
        "total_revenue": total_revenue,
        "total_units": total_units,
    }

    # =========================================================
    # PRODUCT ANALYSIS
    # =========================================================

    if "product" in df.columns:

        product_analysis = (
            df.groupby("product")
            .agg(
                revenue=("revenue", "sum"),
                units_sold=("quantity", "sum"),
            )
            .sort_values(
                "revenue",
                ascending=False
            )
        )

        product_analysis["revenue_share"] = (
            product_analysis["revenue"]
            / total_revenue
            * 100
        )

        analytics["product_performance"] = (
            product_analysis
            .reset_index()
            .to_dict(orient="records")
        )

    # =========================================================
    # REGION ANALYSIS
    # =========================================================

    if "region" in df.columns:

        region_analysis = (
            df.groupby("region")
            .agg(
                revenue=("revenue", "sum"),
                units_sold=("quantity", "sum"),
            )
            .sort_values(
                "revenue",
                ascending=False
            )
        )

        region_analysis["revenue_share"] = (
            region_analysis["revenue"]
            / total_revenue
            * 100
        )

        analytics["regional_performance"] = (
            region_analysis
            .reset_index()
            .to_dict(orient="records")
        )

    # =========================================================
    # BUSINESS INSIGHTS
    # =========================================================

    insights = []

    # ---------------------------------------------------------
    # TOP PRODUCT
    # ---------------------------------------------------------

    if "product_performance" in analytics:

        products = analytics[
            "product_performance"
        ]

        if products:

            top_product = products[0]

            product_name = top_product["product"]

            product_revenue = float(
                top_product["revenue"]
            )

            revenue_share = float(
                top_product["revenue_share"]
            )

            insights.append(
                f"{product_name} is the strongest revenue driver, generating "
                f"€{product_revenue:,.2f} and contributing "
                f"{revenue_share:.1f}% of total revenue."
            )

    # ---------------------------------------------------------
    # TOP REGION
    # ---------------------------------------------------------

    if "regional_performance" in analytics:

        regions = analytics[
            "regional_performance"
        ]

        if regions:

            top_region = regions[0]

            region_name = top_region["region"]

            region_revenue = float(
                top_region["revenue"]
            )

            region_share = float(
                top_region["revenue_share"]
            )

            insights.append(
                f"{region_name} is the strongest-performing region, "
                f"generating €{region_revenue:,.2f} "
                f"({region_share:.1f}% of total revenue)."
            )

    # =========================================================
    # PRODUCT CONCENTRATION
    # =========================================================

    if "product_performance" in analytics:

        products = analytics[
            "product_performance"
        ]

        if len(products) >= 2:

            top_share = float(
                products[0]["revenue_share"]
            )

            second_share = float(
                products[1]["revenue_share"]
            )

            combined_share = (
                top_share + second_share
            )

            if combined_share >= 60:

                insights.append(
                    f"The top two products account for "
                    f"{combined_share:.1f}% of total revenue, "
                    f"indicating a relatively concentrated product mix."
                )

    # =========================================================
    # HIGH VOLUME / LOW REVENUE SIGNAL
    # =========================================================

    if "product_performance" in analytics:

        products = analytics[
            "product_performance"
        ]

        if len(products) >= 2:

            max_units = max(
                p["units_sold"]
                for p in products
            )

            for product in products:

                if (
                    product["units_sold"]
                    == max_units
                ):

                    highest_volume_product = (
                        product
                    )

                    break

            highest_volume_name = (
                highest_volume_product["product"]
            )

            highest_volume_share = float(
                highest_volume_product[
                    "revenue_share"
                ]
            )

            if highest_volume_share < 25:

                insights.append(
                    f"{highest_volume_name} has the highest unit volume "
                    f"but contributes only "
                    f"{highest_volume_share:.1f}% of revenue. "
                    f"This may indicate a lower-value product mix."
                )

    # =========================================================
    # REGION CONCENTRATION
    # =========================================================

    if "regional_performance" in analytics:

        regions = analytics[
            "regional_performance"
        ]

        if len(regions) >= 2:

            top_region_share = float(
                regions[0]["revenue_share"]
            )

            if top_region_share >= 50:

                insights.append(
                    f"{regions[0]['region']} generates "
                    f"{top_region_share:.1f}% of total revenue, "
                    f"creating a significant dependence on this market."
                )

    # =========================================================
    # DATA QUALITY SIGNAL
    # =========================================================

    missing_values = int(
        df.isnull().sum().sum()
    )

    if missing_values > 0:

        insights.append(
            f"The dataset contains {missing_values:,} missing values. "
            f"These should be reviewed before using the data for "
            f"high-stakes business decisions."
        )

    else:

        insights.append(
            "No missing values were detected in the analyzed dataset."
        )

    # =========================================================
    # FINAL RESULT
    # =========================================================

    analytics["insights"] = insights

    return analytics