import pandas as pd


def profile_dataframe(df: pd.DataFrame) -> dict:
    """
    Analyze the structure and quality of a dataset.
    """

    missing_values = int(df.isnull().sum().sum())

    numeric_columns = df.select_dtypes(
        include="number"
    ).columns.tolist()

    categorical_columns = df.select_dtypes(
        include=["object", "category"]
    ).columns.tolist()

    return {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "column_names": df.columns.tolist(),
        "missing_values": missing_values,
        "numeric_columns": numeric_columns,
        "categorical_columns": categorical_columns,
    }