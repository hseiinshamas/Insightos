def generate_ai_analysis(
    kpis: dict,
    analytics: dict,
    anomalies: dict
) -> dict:
    """
    Generate a structured business analysis
    from the results of the analytics engine.

    This layer focuses on interpretation rather
    than calculating raw statistics.
    """

    recommendations = []

    strengths = []

    risks = []

    opportunities = []

    # =========================================================
    # BUSINESS STRENGTHS
    # =========================================================

    if analytics.get("product_performance"):

        products = analytics[
            "product_performance"
        ]

        if products:

            top_product = products[0]

            strengths.append(
                f"{top_product['product']} is the "
                f"strongest revenue-generating product, "
                f"producing €{top_product['revenue']:,.2f}."
            )

    if analytics.get("regional_performance"):

        regions = analytics[
            "regional_performance"
        ]

        if regions:

            top_region = regions[0]

            strengths.append(
                f"{top_region['region']} is the strongest "
                f"revenue-generating region, producing "
                f"€{top_region['revenue']:,.2f}."
            )

    # =========================================================
    # RISKS
    # =========================================================

    for anomaly in anomalies.get(
        "anomalies",
        []
    ):

        if anomaly["severity"] == "high":

            risks.append(
                anomaly["message"]
            )

    # =========================================================
    # OPPORTUNITIES
    # =========================================================

    if analytics.get("product_performance"):

        products = analytics[
            "product_performance"
        ]

        if len(products) >= 2:

            highest_volume = max(
                products,
                key=lambda x:
                x["units_sold"]
            )

            highest_revenue = max(
                products,
                key=lambda x:
                x["revenue"]
            )

            if (
                highest_volume["product"]
                !=
                highest_revenue["product"]
            ):

                opportunities.append(
                    f"{highest_volume['product']} has strong "
                    f"unit volume but is not the leading "
                    f"revenue product. Pricing, bundling or "
                    f"upselling strategies could increase "
                    f"its revenue contribution."
                )

    # =========================================================
    # RECOMMENDATIONS
    # =========================================================

    if risks:

        recommendations.append(
            "Reduce dependency on concentrated "
            "products or markets by diversifying "
            "revenue sources."
        )

    if opportunities:

        recommendations.append(
            "Investigate pricing, bundling and "
            "upselling opportunities for high-volume "
            "but lower-value products."
        )

    if not recommendations:

        recommendations.append(
            "Continue monitoring revenue, product "
            "and regional performance as additional "
            "data becomes available."
        )

    # =========================================================
    # EXECUTIVE SUMMARY
    # =========================================================

    summary_parts = []

    if kpis.get("total_revenue") is not None:

        summary_parts.append(
            f"The business generated "
            f"€{kpis['total_revenue']:,.2f} "
            f"in total revenue."
        )

    if kpis.get("orders") is not None:

        summary_parts.append(
            f"It recorded "
            f"{kpis['orders']:,} orders."
        )

    if strengths:

        summary_parts.append(
            strengths[0]
        )

    if risks:

        summary_parts.append(
            "The analysis also identified "
            f"{len(risks)} significant "
            "business risk(s) that may require "
            "attention."
        )

    executive_summary = " ".join(
        summary_parts
    )

    return {

        "executive_summary":
            executive_summary,

        "strengths":
            strengths,

        "risks":
            risks,

        "opportunities":
            opportunities,

        "recommendations":
            recommendations
    }