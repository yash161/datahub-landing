from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


OUTPUT = "output/pdf/Yash_Shah_Anori_Applied_AI_Research_Engineer_Cover_Letter.pdf"


def build_pdf():
    navy = colors.HexColor("#10243E")
    blue = colors.HexColor("#2878C8")
    slate = colors.HexColor("#425466")
    light = colors.HexColor("#DCE7F2")
    styles = getSampleStyleSheet()

    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        rightMargin=0.72 * inch,
        leftMargin=0.72 * inch,
        topMargin=0.62 * inch,
        bottomMargin=0.58 * inch,
        title="Yash Shah - Anori Applied AI Research Engineer Cover Letter",
        author="Yash Shah",
        subject="Application for Applied AI Research Engineer at Anori",
    )

    name_style = ParagraphStyle(
        "Name",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=21,
        leading=24,
        textColor=navy,
        spaceAfter=2,
    )
    role_style = ParagraphStyle(
        "Role",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=12,
        textColor=blue,
        uppercase=True,
    )
    contact_style = ParagraphStyle(
        "Contact",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.8,
        leading=12,
        alignment=TA_RIGHT,
        textColor=slate,
    )
    meta_style = ParagraphStyle(
        "Meta",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=slate,
    )
    subject_style = ParagraphStyle(
        "Subject",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11.2,
        leading=15,
        textColor=navy,
        spaceAfter=14,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10.15,
        leading=15.55,
        textColor=colors.HexColor("#202C39"),
        spaceAfter=12.5,
    )
    closing_style = ParagraphStyle(
        "Closing",
        parent=body_style,
        spaceAfter=0,
    )

    name_block = Table(
        [[Paragraph("Yash Shah", name_style)],
         [Paragraph("APPLIED AI &amp; ML SYSTEMS ENGINEER", role_style)]],
        colWidths=[3.0 * inch],
    )
    name_block.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))

    header = Table(
        [[
            name_block,
            Paragraph(
                "San Mateo, CA<br/>"
                "213-301-8249 &nbsp; | &nbsp; yashshah3698@gmail.com<br/>"
                "linkedin.com/in/yash-shah &nbsp; | &nbsp; github.com/yash161",
                contact_style,
            ),
        ]],
        colWidths=[3.0 * inch, 3.83 * inch],
    )
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))

    story = [
        header,
        Spacer(1, 10),
        Table([[""]], colWidths=[6.83 * inch], rowHeights=[1.4], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), blue),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ])),
        Spacer(1, 18),
        Paragraph("September 30, 2026", meta_style),
        Spacer(1, 11),
        Paragraph("Hiring Team<br/><b>Anori</b><br/>San Mateo, CA", meta_style),
        Spacer(1, 15),
        Paragraph("Re: Applied AI Research Engineer", subject_style),
        Paragraph("Dear Anori Hiring Team,", body_style),
        Paragraph(
            "I am applying for the Applied AI Research Engineer role because Anori is using AI to turn complex, real-world constraints into reliable decisions that improve how buildings are designed and delivered. I bring more than three years of experience building AI systems and production automation in Python, with hands-on work in agentic workflows, rigorous validation, multimodal document processing, and cloud deployment.",
            body_style,
        ),
        Paragraph(
            "As an Agentic AI Research Assistant at California State University, Los Angeles, I built an AI-assisted grading platform using Claude and OpenAI APIs, a dynamic rubric engine, and a validation layer. The system reduced turnaround from three days to four hours for more than 50 students. I also automated grade publishing through the Canvas LMS API across two semesters, adding permission checks and payload validation that maintained zero posting errors. The work required me to move from an ambiguous problem to a useful prototype, benchmark behavior, validate edge cases, and operate the result reliably for real users.",
            body_style,
        ),
        Paragraph(
            "At Zipline, I strengthened Python and Bazel automation for a hardware-in-the-loop environment supporting more than 330 locations. I redesigned resource selection and validation workflows, improved CI reliability under concurrent demand, and cut failure diagnosis time by 25% through better observability. My project work adds production AI depth: a document intelligence platform for PDFs and other business files, a local LLM agent that diagnoses CI failures while keeping source code on premises, and an MLflow and FastAPI pipeline for real-world IoT sensor data. Across these systems, I have owned evaluation, containerization, deployment, monitoring, and iteration.",
            body_style,
        ),
        Paragraph(
            "I would be excited to apply this background to regulatory data, where accuracy, traceability, and careful handling of nuanced conditions matter as much as model capability. Anori's early-stage environment fits how I work: I am comfortable moving between research, software engineering, infrastructure, and user feedback to deliver a complete capability. I would welcome the opportunity to help build an AI platform that makes housing development more sustainable and equitable.",
            body_style,
        ),
        Paragraph("Thank you for your consideration. I look forward to speaking with you.", body_style),
        Spacer(1, 8),
        Paragraph("Sincerely,<br/><br/><b>Yash Shah</b>", closing_style),
    ]

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
