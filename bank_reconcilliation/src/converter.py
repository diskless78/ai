import os
import re
from docling.document_converter import DocumentConverter

class ConvertExcelToMarkdown:
    """
        Convert Excel to Markdown
    """
    def __init__(self):
        self.converter = DocumentConverter()

    def convert_to_markdown(self, file_path):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File does not exist: {file_path}")
        try:
            result = self.converter.convert(file_path)
            return result.document.export_to_markdown()
        except Exception as e:
            return None

class MarkdownCleaner:
    """
        Cleansing Markdown data
    """
    def __init__(self):
        self.exclude_keywords = ['tổng số', '---', 'ngày thực hiện', 'sao kê tài khoản']

    def clean(self, markdown_raw):
        if not markdown_raw: return ""
        lines = markdown_raw.split('\n')
        ner_ready_data = []
        for line in lines:
            line_clean = line.replace('|', ' ').replace('None', '').replace('\xa0', ' ')
            line_clean = re.sub(r'\s+', ' ', line_clean).strip()
            if not line_clean or any(key in line_clean.lower() for key in self.exclude_keywords):
                continue
            parts = line_clean.split()
            unique_parts = []
            for p in parts:
                if not unique_parts or p != unique_parts[-1]:
                    unique_parts.append(p)
            ner_ready_data.append(" ".join(unique_parts))
        return "\n".join(ner_ready_data)
