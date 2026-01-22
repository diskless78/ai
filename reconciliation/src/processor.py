import re
from docling.document_converter import DocumentConverter


class BankStatementProcessor:
    # Convert to markdown
    def __init__(self):
        self.converter = DocumentConverter()
    # Format currency
    def format_currency(self, value):
        formatted = "{:,.2f}".format(value)
        return formatted.replace(',', '.')
    # Parse money from text
    def parse_money_from_text(self, text):
        if not text or str(text).lower() == 'none': return 0.00
        clean_val = str(text).replace(',', '').strip()
        match = re.search(r"(\d+\.?\d*)", clean_val)
        return float(match.group(1)) if match else 0.00
    # Exatract banking transaction
    def extract_banking_data(self, file_path):
        doc_result = self.converter.convert(file_path)
        md_text = doc_result.document.export_to_markdown()

        def find_meta(label):
            match = re.search(rf"{label}\s*:\s*\|?\s*([^|\n]+)", md_text)
            return match.group(1).strip() if match else "N/A"

        common_meta = {
            "bank_owner": find_meta("Chủ tài khoản"),
            "account_num": find_meta("Số tài khoản"),
            "cif": find_meta("CIF"),
            "address": find_meta("Địa chỉ").replace(',', '').replace('\n', ' ').strip(),
            "currency": "VND"
        }

        output_strings = []
        for table in doc_result.document.tables:
            df = table.export_to_dataframe(doc=doc_result.document)
            for _, row in df.iterrows():
                cells = [str(c).strip() for c in row.values]
                if any(re.search(r"\d{4}-\d{2}-\d{2}", cell) for cell in cells[:1]):
                    try:
                        date_raw = cells[0].split(' ')[0]
                        d_p = date_raw.split('-')
                        date_str = f"{d_p[2]}/{d_p[1]}/{d_p[0]}"

                        ref_num = cells[1]
                        net_val = self.parse_money_from_text(cells[3])
                        description = cells[4] if len(cells) > 4 else ""

                        tax_match = re.search(r"VAT Amt:.*?=\s*([\d,.]+)\s*VND", description)
                        tax_val = self.parse_money_from_text(tax_match.group(1)) if tax_match else 0.00

                        gross_match = re.search(r"Gross Amt:.*?=\s*([\d,.]+)\s*VND", description)
                        gross_val = self.parse_money_from_text(gross_match.group(1)) if gross_match else net_val
                        if gross_val == 0 and net_val > 0: gross_val = net_val

                        record = (
                            f"Thông tin đối soát:\n"
                            f"    Ngày giao dịch: {date_str}\n"
                            f"    Số tham chiếu: {ref_num}\n"
                            f"    Số tiền ghi có: {self.format_currency(net_val)}\n"
                            f"    VAT Amt: {self.format_currency(tax_val)} VND\n"
                            f"    Gross Amt: {self.format_currency(gross_val)} VND\n\n"
                            f"Chi tiết giao dịch:\n"
                            f"    Chủ tài khoản: {common_meta['bank_owner']}\n"
                            f"    Số tài khoản: {common_meta['account_num']}\n"
                            f"    CIF: {common_meta['cif']}\n"
                            f"    Địa chỉ: {common_meta['address']}\n"
                            f"    Loại tiền: {common_meta['currency']}\n"
                            f"    Mô tả: {description}"
                        )
                        output_strings.append(record)
                    except:
                        continue
        return "\n\n---\n\n".join(output_strings)