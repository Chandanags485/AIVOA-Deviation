from app.ai.workflow import analyze_deviation


sample_text = """
Deviation Report

Deviation Title:
Temperature excursion during API manufacturing batch.

Batch Number:
API-B24091

Process Step:
Final reaction stage

Parameter:
Reaction temperature

Observed Value:
82°C

Approved Range:
75°C to 80°C

Duration:
18 minutes

Description:
During the final reaction stage of API batch B24091,
the reactor temperature increased to 82°C. The approved
operating range is 75°C to 80°C.

The excursion was identified by the production operator
during routine monitoring and lasted approximately
18 minutes. The temperature was subsequently returned
to the approved range.

Potential Impact:
The temperature excursion may affect reaction conditions
and could potentially influence product quality.
Batch impact should be evaluated against process
validation data and applicable specifications.
"""


result = analyze_deviation(sample_text)

print("\n========== EXTRACTED DATA ==========")
print(result["extracted"])

print("\n========== AI RISK ASSESSMENT ==========")
print(result["risk"])