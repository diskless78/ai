import streamlit as st
import os
import json
from src.converter import ConvertExcelToMarkdown, MarkdownCleaner
from src.formatter import VCBFormatter
from src.extractor import BankNERPredictor

# --- Cấu hình hằng số ---
MODEL_PATH = "/Users/thanhdc/Data/Repository/Model/banking_model_v1"
THRESHOLD = 0.7

model_name = os.path.basename(MODEL_PATH)
st.set_page_config(page_title="Banking Extraction UI", layout="wide", page_icon="🏦")


@st.cache_resource
def load_models():
    """
        Loading models and processing classes
    """
    return {
        "converter": ConvertExcelToMarkdown(),
        "cleaner": MarkdownCleaner(),
        "formatter": VCBFormatter(),
        "predictor": BankNERPredictor(MODEL_PATH)
    }


models = load_models()

# --- Web UI ---
st.title("🏦 Banking Statement NLP Extractor")
st.markdown(f"Extract structured transaction data from banking statement using model **{model_name}**")

with st.sidebar:
    st.header("Upload Banking Statement")
    uploaded_file = st.file_uploader("Upload banking statement (xlsx)", type="xlsx")
    threshold = st.slider("Threshold", 0.1, 1.0, THRESHOLD)

    process_btn = st.button("🚀 Start Process", use_container_width=True)

if uploaded_file and process_btn:
    # 1. Save temp file
    temp_file = "temp_statement.xlsx"
    with open(temp_file, "wb") as f:
        f.write(uploaded_file.getbuffer())

    try:
        with st.status(f"Model **{model_name}** is processing...", expanded=True) as status:
            st.write("1. Convert excel to Markdown...")
            raw_md = models["converter"].convert_to_markdown(temp_file)

            if not raw_md:
                st.error("Failed to convert excel to markdown !")
                st.stop()

            clean_md = models["cleaner"].clean(raw_md)

            st.write("2. Format markdown to flat text...")
            test_lines = models["formatter"].generate_test_lines(clean_md)

            st.write(f"3. Running Inference for {len(test_lines)} transactions...")

            status.update(label="Process has done.", state="complete", expanded=False)

        st.divider()
        st.subheader(f"📊 Extracting to {len(test_lines)} transactions")

        for i, line in enumerate(test_lines, 1):
            with st.expander(f"Transaction #{i}", expanded=(i == 1)):
                data_json, data_text = models["predictor"].predict_line(line, threshold=threshold)

                col1, col2 = st.columns([1, 1])

                with col1:
                    st.markdown("**📄 Plain Text Format**")
                    st.text(data_text if data_text else "Prediction was failed, check the threshold.")

                with col2:
                    st.markdown("**📦 JSON Format**")
                    st.json(data_json)

    except Exception as e:
        st.error(f"Error: {e}")
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

else:
    st.info("Please upload excel file and press 'Start Process' button.")