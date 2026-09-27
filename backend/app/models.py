from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database import Base


class Deviation(Base):
    __tablename__ = "deviations"

    id = Column(Integer, primary_key=True, index=True)

    deviation_title = Column(String)
    batch_number = Column(String)
    process_step = Column(String)
    parameter = Column(String)
    observed_value = Column(String)
    approved_range = Column(String)
    duration = Column(String)

    description = Column(Text)
    potential_impact = Column(Text)

    severity = Column(String)
    severity_reason = Column(Text)

    status = Column(String, default="Draft")
    created_at = Column(DateTime, default=datetime.utcnow)