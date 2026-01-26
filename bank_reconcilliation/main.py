import json
from src.converter import ConvertExcelToMarkdown, MarkdownCleaner
from src.formatter import VCBFormatter
from src.extractor import BankNERPredictor

# Hằng số
MODEL_PATH = "/Users/thanhdc/Data/Repository/Model/banking_model_v1"
INPUT_XLSX = 'data/Banking Statement.xlsx'
THRESHOLD = 0.7


def main():
    converter = ConvertExcelToMarkdown()
    cleaner = MarkdownCleaner()
    vcb_formatter = VCBFormatter()
    predictor = BankNERPredictor(MODEL_PATH)

    raw_md = converter.convert_to_markdown(INPUT_XLSX)
    if not raw_md: return

    clean_md = cleaner.clean(raw_md)
    test_lines = vcb_formatter.generate_test_lines(clean_md)

    for i, line in enumerate(test_lines, 1):
        print(f"\n{'=' * 50} Row {i} {'=' * 50}")

        # Get prediction
        data_json, data_text = predictor.predict_line(line, threshold=THRESHOLD)

        print("\n[--- Transaction Text Format ---]")
        print(data_text if data_text else "⚠ No data found.")

        print("\n[--- Transaction JSON Format ---]")
        print(json.dumps(data_json, indent=4, ensure_ascii=False))

if __name__ == "__main__":
    main()