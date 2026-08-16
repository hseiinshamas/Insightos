import pandas as pd


def calculate_kpis(df: pd.DataFrame) -> dict:
    """
    Calculate basic business KPIs from a sales dataset.
    """

    kpis = {
        "rows": int(len(df))
    }

    # Revenue
    if {"price", "quantity"}.issubset(df.columns):
        revenue = df["price"] * df["quantity"]

        kpis["total_revenue"] = float(revenue.sum())
        kpis["units_sold"] = int(df["quantity"].sum())
        kpis["average_order_value"] = float(revenue.mean())

    # Orders
    kpis["orders"] = int(len(df))

    # Products
    if "product" in df.columns:
        product_sales = df.groupby("product")["quantity"].sum()

        if not product_sales.empty:
            kpis["top_product"] = product_sales.idxmax()

    # Regions
    if "region" in df.columns:
        region_sales = df.groupby("region")["quantity"].sum()

        if not region_sales.empty:
            kpis["top_region"] = region_sales.idxmax()

    return kpis