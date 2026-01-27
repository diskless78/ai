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

    def _deduplicate_string(self, text):
        """
            Deduplicate repeated words or phrases in a string.
        """
        if not text or text == "N/A":
            return text

        words = text.split()
        res = []
        for w in words:
            if not res or w != res[-1]:
                res.append(w)

        cleaned = " ".join(res)

        for n in range(1, 5):
            length = len(cleaned) // (n + 1)
            if length > 0:
                part = cleaned[:length].strip()
                if cleaned.replace(part, "").strip() == "":
                    return part

        return cleaned

    def _get_raw_val(self, line):
        """
        Extract value after ':' and deduplicate it.
        """
        if ":" not in line:
            return "N/A"
        raw_val = line.split(":", 1)[1].strip()
        return self._deduplicate_string(raw_val)

    def generate_test_lines(self, clean_markdown):
        lines = clean_markdown.strip().split('\n')
        metadata = {key: "N/A" for key in self.meta_map.keys()}
        list_sentence = []

        # Step 1: Extract metadata
        for line in lines:
            lower_line = line.lower()
            for key, aliases in self.meta_map.items():
                if any(f"{alias}:" in lower_line for alias in aliases):
                    val = self._get_raw_val(line)
                    if val != "N/A":
                        metadata[key] = val

        # Step 2: Extract transaction lines
        for line in lines:
            match = re.match(r'(\d{4}-\d{2}-\d{2})\s\d{2}:\d{2}:\d{2}\s+([\d\s\-]{10,20})\s+(\d+)\s+(.*)', line)

            if match:
                y, m, d = match.group(1).split('-')
                date_vn = f"{d}/{m}/{y}"
                ref = match.group(2).strip()
                amt = match.group(3).strip()
                desc = match.group(4).strip()

                # Step 3: Format final sentence
                sentence = (
                    f"Chủ tài khoản: {metadata['chu_tk']} | Số tài khoản: {metadata['so_tk']} | "
                    f"CIF: {metadata['cif']} | Loại tiền: {metadata['loai_tien']} | Địa chỉ: {metadata['dia_chi']} | "
                    f"Ngày giao dịch: {date_vn} | Số tham chiếu: {ref} | "
                    f"Số tiền ghi nợ: N/A | Số tiền ghi có: {amt} | Mô tả: {desc}"
                )
                list_sentence.append(sentence)

        return list_sentence