import streamlit as st
import os
import json
from src.converter import ConvertExcelToMarkdown, MarkdownCleaner
from src.formatter import VCBFormatter
from src.extractor import BankNERPredictor

st.set_page_config(page_title="Banking Reconciliation", layout="wide")
st.title("🏦 Extract Data Of Banking Statement")

# Init Web UI
if 'processor' not in st.session_state:
    st.session_state.processor = BankStatementProcessor()
    st.session_state.reconciler = MilvusReconciler()

# Sidebar Load Data
with st.sidebar:
    st.header("Upload file sao kê ngân hàng")
    file = st.file_uploader("Nạp file Excel sao kê", type="xlsx")
    if file and st.button("Load Data"):
        temp_file_path = "temp.xlsx"
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        with open(temp_file_path, "wb") as f:
            f.write(file.getbuffer())
        with st.spinner("Đang xử lý data..."):
            data = st.session_state.processor.extract_banking_data(temp_file_path)
            st.session_state.reconciler.process_and_store(data)
            st.success("Data load thành công !")

# searching textbox
query = st.text_area("Nhập thông tin giao dịch cần kiểm tra:", height=150)
if st.button("Đối soát") and query:
    results = st.session_state.reconciler.search(query)
    if results:
        res = results[0]
        st.subheader(f"Kết quả (Độ khớp: {res['distance']:.4f})")
        if res['distance'] > 0.999:
            st.success("✅ KHỚP 100%")
        else:
            st.warning("⚠️ CÓ SAI LỆCH")
        st.code(res['entity']['metadata_detail'], language="text")
    else:
        st.error("Không tìm thấy giao dịch.")