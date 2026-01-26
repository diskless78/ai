
import re

class VCBFormatter:
    """
        Format markdown data as flat text
    """

    def __init__(self):
        # Define header mapping
        self.meta_map = {
            "chu_tk": ["chủ tài khoản", "chủ tk", "tên tài khoản"],
            "so_tk": ["số tài khoản", "stk", "số tk"],
            "dia_chi": ["địa chỉ", "address"],
            "cif": ["cif", "mã khách hàng"],
            "loai_tien": ["loại tiền", "currency"]
        }

    def _get_raw_val(self, line):
        """
            Extract value after ':' in a line.
        """
        if ":" not in line: return "N/A"
        return line.split(":", 1)[1].strip()

    def generate_test_lines(self, clean_markdown):
        lines = clean_markdown.strip().split('\n')
        metadata = {key: "N/A" for key in self.meta_map.keys()}
        list_sentence = []

        for line in lines:
            lower_line = line.lower()
            for key, aliases in self.meta_map.items():
                if any(f"{alias}:" in lower_line for alias in aliases):
                    metadata[key] = self._get_raw_val(line)

        for line in lines:
            match = re.match(r'(\d{4}-\d{2}-\d{2})\s\d{2}:\d{2}:\d{2}\s+([\d\s\-]{10,20})\s+(\d+)\s+(.*)', line)

            if match:
                y, m, d = match.group(1).split('-')
                date_vn = f"{d}/{m}/{y}"
                ref = match.group(2).strip()
                amt = match.group(3).strip()
                desc = match.group(4).strip()

                sentence = (
                    f"Chủ tài khoản: {metadata['chu_tk']} | Số tài khoản: {metadata['so_tk']} | "
                    f"CIF: {metadata['cif']} | Loại tiền: {metadata['loai_tien']} | Địa chỉ: {metadata['dia_chi']} | "
                    f"Ngày giao dịch: {date_vn} | Số tham chiếu: {ref} | "
                    f"Số tiền ghi nợ: N/A | Số tiền ghi có: {amt} | Mô tả: {desc}"
                )
                list_sentence.append(sentence)

        return list_sentence