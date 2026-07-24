import os
import fitz
from paddleocr import PaddleOCR


# Initialize OCR once
ocr = PaddleOCR(
    lang="en"
)


def extract_text_with_ocr(image_path: str) -> str:
    """
    Extract text from an image using PaddleOCR.
    """

    try:
        result = ocr.predict(image_path)

        extracted_lines = []

        for page_result in result:

            # PaddleOCR returns recognized text in rec_texts
            data = page_result.json

            if "res" in data:
                texts = data["res"].get("rec_texts", [])

                extracted_lines.extend(texts)

        text = "\n".join(extracted_lines)

        if not text.strip():
            raise ValueError(
                "OCR could not detect any text."
            )

        return text.strip()

    except Exception as error:
        raise RuntimeError(
            f"OCR failed: {error}"
        )


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF.

    First tries normal PDF text extraction.

    If no useful text exists, it automatically
    converts PDF pages to images and uses OCR.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(
            f"PDF file not found: {file_path}"
        )

    try:

        document = fitz.open(file_path)

        extracted_text = []

        for page_number, page in enumerate(document):

            # -----------------------------------
            # Try normal PDF extraction first
            # -----------------------------------

            text = page.get_text().strip()

            if text:

                extracted_text.append(text)

            else:

                print(
                    f"Page {page_number + 1} "
                    f"has no selectable text. Running OCR..."
                )

                # -----------------------------------
                # Convert scanned page to image
                # -----------------------------------

                pixmap = page.get_pixmap(
                    matrix=fitz.Matrix(2, 2)
                )

                temp_image = (
                    f"_temp_page_{page_number}.png"
                )

                pixmap.save(temp_image)

                try:

                    # Run OCR
                    ocr_text = extract_text_with_ocr(
                        temp_image
                    )

                    extracted_text.append(
                        ocr_text
                    )

                finally:

                    # Delete temporary image
                    if os.path.exists(temp_image):
                        os.remove(temp_image)

        document.close()

        final_text = "\n\n".join(
            extracted_text
        )

        if not final_text.strip():

            raise ValueError(
                "No text could be extracted "
                "from the PDF."
            )

        return final_text.strip()

    except Exception as error:

        raise RuntimeError(
            f"Failed to process PDF: {error}"
        )


def extract_text_from_image(
    file_path: str
) -> str:

    """
    Extract text directly from JPG/PNG images.
    """

    if not os.path.exists(file_path):

        raise FileNotFoundError(
            f"Image not found: {file_path}"
        )

    return extract_text_with_ocr(
        file_path
    )


# -----------------------------------------------------------
# Supported file extensions
# -----------------------------------------------------------

SUPPORTED_PDF_EXTENSIONS = {".pdf"}

SUPPORTED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}

ALL_SUPPORTED_EXTENSIONS = (
    SUPPORTED_PDF_EXTENSIONS | SUPPORTED_IMAGE_EXTENSIONS
)


def process_document(file_path: str) -> str:
    """
    Universal entry point for document processing.

    Automatically detects the file type and routes to the
    correct extractor:

      - PDF  → PyMuPDF (with automatic PaddleOCR fallback
                         for scanned / image-only pages)
      - JPG / JPEG / PNG → PaddleOCR

    Returns the full extracted text as a plain string.

    Raises:
        FileNotFoundError  – file path does not exist
        ValueError         – unsupported file format, or no
                             text could be extracted
        RuntimeError       – underlying extraction failure
    """

    # --------------------------------------------------
    # 1. Validate path
    # --------------------------------------------------

    if not file_path or not file_path.strip():
        raise ValueError(
            "File path cannot be empty."
        )

    if not os.path.exists(file_path):
        raise FileNotFoundError(
            f"File not found: {file_path}"
        )

    if not os.path.isfile(file_path):
        raise ValueError(
            f"Path is not a file: {file_path}"
        )

    # --------------------------------------------------
    # 2. Detect file type from extension
    # --------------------------------------------------

    _, ext = os.path.splitext(file_path)
    ext = ext.lower()

    if ext not in ALL_SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file format: '{ext}'. "
            f"Supported formats are: "
            f"{', '.join(sorted(ALL_SUPPORTED_EXTENSIONS))}"
        )

    # --------------------------------------------------
    # 3. Route to the correct extractor
    # --------------------------------------------------

    if ext in SUPPORTED_PDF_EXTENSIONS:
        print(f"[document_processor] Detected PDF: {file_path}")
        return extract_text_from_pdf(file_path)

    else:
        print(f"[document_processor] Detected image ({ext}): {file_path}")
        return extract_text_from_image(file_path)