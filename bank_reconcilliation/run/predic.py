from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import os
import json

# 1. Init Model & Tokenizer
model_path = "/Users/thanhdc/Data/Repository/Model/banking_model_v1"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForTokenClassification.from_pretrained(model_path)

# 2. Create Pipeline
nlp = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

# 3. Read Input
file_path = "trans_test.txt"
if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read().strip()
else:
    exit(f"⚠ File not found: {file_path}")

# 4. Run Inference
results = nlp(text)
THRESHOLD = 0.7


def process_outputs(results, threshold=0.7):
    # Mapping to display names in Vietnamese
    display_name = {
        "VALUE_ACC_NAME": "Chủ tài khoản",
        "VALUE_ACC_NUM": "Số tài khoản",
        "VALUE_CIFS": "CIF",
        "VALUE_CURRENCY_TYPE": "Loại tiền",
        "VALUE_ACC_ADDR": "Địa chỉ",
        "VALUE_TRANS_DATE": "Ngày giao dịch",
        "VALUE_REF_NUM": "Số tham chiếu",
        "VALUE_DEBT_NUM": "Số tiền ghi nợ",
        "VALUE_CRED_NUM": "Số tiền ghi có",
        "VALUE_TRANS_DESC": "Mô tả"
    }

    data_dict = {}
    for res in results:
        if res['score'] < threshold:
            continue

        label = res['entity_group']
        value = res['word'].strip()

        if label not in data_dict:
            data_dict[label] = value
        else:
            sep = " " if label == "VALUE_TRANS_DESC" else ""
            data_dict[label] += f"{sep}{value}"

    plain_text_lines = []
    for label_key, label_vn in display_name.items():
        if label_key in data_dict:
            plain_text_lines.append(f"{label_vn}: {data_dict[label_key]}")

    return data_dict, "\n".join(plain_text_lines)


# 5. Get results in both JSON and plain text formats
final_json, final_text = process_outputs(results, THRESHOLD)

print("\n--- Transaction in Text  Format ---")
print(final_text)

print("\n--- Transaction in JSON ---")
print(json.dumps(final_json, indent=4, ensure_ascii=False))