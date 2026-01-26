import json
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline


class BankNERPredictor:
    def __init__(self, model_path):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForTokenClassification.from_pretrained(model_path)
        self.nlp = pipeline(
            "ner",
            model=self.model,
            tokenizer=self.tokenizer,
            aggregation_strategy="simple"
        )
        # Mapping label code to display names
        self.display_mapping = {
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

    def predict_line(self, text_line, threshold=0.7):
        results = self.nlp(text_line)

        data_dict = {}
        for res in results:
            if res['score'] < threshold:
                continue

            label = res['entity_group']
            value = res['word'].strip()

            if label not in data_dict:
                data_dict[label] = value
            else:
                sep = " " if "DESC" in label or "ADDR" in label else ""
                data_dict[label] += f"{sep}{value}"

        # Mapping label to header in Vietnamese
        standard_keys = {
            "KEY_ACC_NAME": "Chủ tài khoản",
            "KEY_ACC_NUM": "Số tài khoản",
            "KEY_CIFS": "CIF",
            "KEY_REF_NUM": "Số tham chiếu",
            "KEY_DEBT_NUM": "Số tiền ghi nợ",
            "KEY_CRED_NUM": "Số tiền ghi có",
            "KEY_TRANS_DESC": "Mô tả"
        }

        for label in list(data_dict.keys()):
            if label in standard_keys:
                data_dict[label] = standard_keys[label]

        plain_text_lines = []
        for key_code, display_name in self.display_mapping.items():
            if key_code in data_dict:
                plain_text_lines.append(f"{display_name}: {data_dict[key_code]}")

        final_plain_text = "\n".join(plain_text_lines)

        return data_dict, final_plain_text