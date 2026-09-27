from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from pypdf import PdfReader

from app.ai.workflow import analyze_deviation
from app.database import get_db
from app.models import Deviation


router = APIRouter(
    prefix="/api/deviations",
    tags=["Deviations"]
)


class DeviationTextRequest(BaseModel):
    text: str


class DeviationCreate(BaseModel):
    deviation_title: str
    batch_number: str
    process_step: str
    parameter: str
    observed_value: str
    approved_range: str
    duration: str
    description: str
    potential_impact: str
    severity: str
    severity_reason: str
    status: str = "Draft"


@router.post("/analyze-text")
def analyze_text(request: DeviationTextRequest):
    result = analyze_deviation(request.text)

    return {
        "success": True,
        "data": result
    }


@router.post("/analyze-pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    contents = await file.read()

    import io

    pdf_file = io.BytesIO(contents)
    reader = PdfReader(pdf_file)

    extracted_text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            extracted_text += page_text + "\n"

    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the PDF."
        )

    result = analyze_deviation(extracted_text)

    return {
        "success": True,
        "filename": file.filename,
        "extracted_text": extracted_text,
        "data": result
    }


@router.post("/save")
def save_deviation(
    deviation: DeviationCreate,
    db: Session = Depends(get_db)
):
    new_deviation = Deviation(
        deviation_title=deviation.deviation_title,
        batch_number=deviation.batch_number,
        process_step=deviation.process_step,
        parameter=deviation.parameter,
        observed_value=deviation.observed_value,
        approved_range=deviation.approved_range,
        duration=deviation.duration,
        description=deviation.description,
        potential_impact=deviation.potential_impact,
        severity=deviation.severity,
        severity_reason=deviation.severity_reason,
        status=deviation.status
    )

    db.add(new_deviation)
    db.commit()
    db.refresh(new_deviation)

    return {
        "success": True,
        "message": "Deviation saved successfully",
        "id": new_deviation.id
    }