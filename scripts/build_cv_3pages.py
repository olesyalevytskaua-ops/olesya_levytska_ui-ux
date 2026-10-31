from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether, PageBreak, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from xml.sax.saxutils import escape
import fitz, os

REG='/usr/share/fonts/truetype/lato/Lato-Regular.ttf'
MED='/usr/share/fonts/truetype/lato/Lato-Medium.ttf'
BOLD='/usr/share/fonts/truetype/lato/Lato-Bold.ttf'
BLACK='/usr/share/fonts/truetype/lato/Lato-Heavy.ttf'
for n,f in [('Lato',REG),('LatoM',MED),('LatoB',BOLD),('LatoH',BLACK)]:pdfmetrics.registerFont(TTFont(n,f))
pdfmetrics.registerFontFamily('Lato',normal='Lato',bold='LatoB',italic='Lato',boldItalic='LatoB')
NAVY=HexColor('#1F2636');PURPLE=HexColor('#5A35CE'); MUTED=HexColor('#424C5E');GRAY=HexColor('#6A7282');LINE=HexColor('#DADDE6');PALE=HexColor('#F8F6FD')
PAGE_W,PAGE_H=A4
FILE='docs/Olesya-Levytska-CV.pdf'
styles={}
def st(name,size,leading=None,color=MUTED,font='Lato',spaceBefore=0,spaceAfter=0,keepWithNext=False):
 styles[name]=ParagraphStyle(name,fontName=font,fontSize=size,leading=leading or size*1.32,textColor=color,spaceBefore=spaceBefore,spaceAfter=spaceAfter,keepWithNext=keepWithNext,allowWidows=0,allowOrphans=0)
st('name',24,27,NAVY,'LatoH',spaceAfter=0,keepWithNext=True)
st('role',12.2,16,PURPLE,'LatoB',spaceAfter=5,keepWithNext=True)
st('contacts',9.1,13,MUTED,spaceAfter=1)
st('summary',9.7,13.1,MUTED,spaceAfter=4)
st('mini',9.3,12.5,MUTED,spaceAfter=2)
st('p',9.65,13.25,MUTED,spaceAfter=4)
st('bul',9.55,12.95,MUTED,spaceAfter=4)
st('compact',9.45,12.6,MUTED,spaceAfter=3)
st('header',10.4,13.2,PURPLE,'LatoH',spaceBefore=11,spaceAfter=4,keepWithNext=True)
st('company',12.1,15,NAVY,'LatoH',spaceBefore=9,spaceAfter=1,keepWithNext=True)
st('subtitle',9.8,13,PURPLE,'LatoB',spaceAfter=5,keepWithNext=True)
st('project',10.2,13.5,NAVY,'LatoB',spaceBefore=6,spaceAfter=3,keepWithNext=True)
st('smalltitle',10,13,NAVY,'LatoB',spaceBefore=5,spaceAfter=2,keepWithNext=True)
st('l',9.45,12.5,MUTED,spaceAfter=1)
st('kicker',9,11,PURPLE,'LatoB',spaceBefore=5,spaceAfter=3)

def P(txt,style='p'):return Paragraph(txt,styles[style])
flow=[]
def add(txt,style='p'):flow.append(P(txt,style))
def sp(h):flow.append(Spacer(1,h))
def rule():flow.append(HRFlowable(width='100%',thickness=.65,color=LINE,spaceBefore=0,spaceAfter=4))
def section(title): add(title.upper(),'header');rule()
def company(n,date,role): add(f'{n} <font color="#777F8E" size="10">| {date}</font>','company');add(role,'subtitle')
def project(n,date,desc=None):add(f'{n} <font color="#777F8E" size="9.6">| {date}</font>','project');
def bullet(txt):add('<font color="#5A35CE">&#8226;</font>  '+txt,'bul')
def compact(txt):add(txt,'compact')

def frame(c,doc):
 c.saveState();c.setStrokeColor(LINE);c.setLineWidth(.6);c.line(14*mm,15*mm,PAGE_W-14*mm,15*mm)
 c.setFont('LatoM',9);c.setFillColor(GRAY);c.drawRightString(PAGE_W-14*mm,11.1*mm,f'{doc.page} / 3');c.restoreState()

# Page 1 - immediate value and Computools
add('Olesya Levytska','name');add('Senior Product Designer  |  HealthTech, AI &amp; SaaS','role')
add('<link href="mailto:olesyalevytskaua@gmail.com" color="#5A35CE">olesyalevytskaua@gmail.com</link>  ·  +380 97 750 5802  ·  Kyiv, Ukraine  ·  Remote UK &amp; Europe / Open to relocation','contacts')
add('<link href="https://olesyalevytskaua-ops.github.io/olesya_levytska_ui-ux/work.html" color="#5A35CE">Portfolio</link>  ·  <link href="https://www.linkedin.com/in/olesya-levytska-321363193/" color="#5A35CE">LinkedIn</link>  ·  English C1 (professional working proficiency)','contacts')
section('Profile')
add('Senior Product Designer with <b>7 years in product and UX design</b> across digital healthcare, AI-powered products and complex multi-role SaaS. Bring 10 years of earlier business analysis experience to research, strategy, workflow design and measurable product decisions. Work end-to-end from discovery and prototyping to design systems, analytics and implementation with engineering teams.','summary')
section('Selected impact')
# compact 2 columns
impact=[
 ('Registration drop-off','Nearly halved after identifying a broken social sign-in and redesigning trust cues.'),
 ('Design system at scale','65 components, 287 tokens; reusable patterns on 84% of VesselHaven screens.'),
 ('Healthcare UX validation','30% relative improvement in task accuracy during ThePause prototype testing.'),
 ('Faster engineering handoff','~45% less development time reported by Remedy leadership after design system rollout.'),
]
rows=[]
for i in range(0,4,2):
 row=[]
 for head,body in impact[i:i+2]:
  row.append(P(f'<font color="#5A35CE"><b>{head}</b></font><br/>{body}','mini'))
 rows.append(row)
t=Table(rows,colWidths=[(PAGE_W-28*mm)/2]*2,hAlign='LEFT')
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),.5,LINE),('INNERGRID',(0,0),(-1,-1),.4,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),5),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),7)]))
flow.append(t)
section('Core expertise')
compact('<b>Product &amp; UX:</b> Product discovery, user research, journeys, information architecture, usability testing, mobile/web SaaS, accessibility, AI experience design, growth funnels and monetisation.')
compact('<b>Systems &amp; delivery:</b> Figma design systems, tokens, prototyping, responsive UI, developer collaboration, GitHub, design-to-code, analytics and experimentation.')
section('Professional experience')
company('Computools','Sep 2025 – Present','Senior Product &amp; UX/UI Designer  ·  Full-time')
project('VesselHaven','Dec 2025 – Present')
compact('Multi-role yacht-management SaaS and services marketplace connecting owners, captains, crew, brokers, guests and service providers.')
bullet('<b>Led discovery and cross-role UX architecture</b>: synthesised research into role-specific dashboards, permissions and connected journeys for trips, crew coordination, guest invitations and service booking.')
bullet('<b>Designed financial operations and payment workflows</b>, including transactions, quotations and branded Stripe payment experiences, translating complex business processes into usable interactions.')
bullet('<b>Reduced onboarding friction</b>: used Hotjar insights to simplify owner registration and guest access through magic-link invitations and progressive data collection.')
bullet('<b>Built a scalable light/dark design system</b> with 65 components and 287 tokens; 84% of screens reused its shared patterns, supporting faster module expansion.')
bullet('Used Claude-assisted prototyping alongside Figma, design reviews and developer collaboration to explore interaction options and improve implementation handoff.')
project('Vaults1','Sep 2025 – Dec 2025')
compact('Designed end-to-end self-storage discovery, comparison, booking and payment journeys, from research and IA to reusable UI components, dashboards and responsive marketing pages.')
flow.append(PageBreak())

# Page 2 - Harmoni and Remedy leadership
section('Professional experience · continued')
company('The Pause Technologies Inc.','Dec 2024 – Present','Senior Product &amp; UX/UI Designer  ·  Contract  |  Harmoni by ThePause')
compact('Women’s HealthTech product combining symptom and cycle tracking, AI-powered guidance, wellness journeys and personalised insights for perimenopause and menopause.')
bullet('<b>Led the ThePause → Harmoni rebrand across app and web</b>, expanding the product experience to women in perimenopause and creating a supportive visual language, shared components and more inclusive onboarding.')
bullet('<b>Shifted roadmap decisions from assumptions to evidence</b>: partnered with developers to introduce Mixpanel tracking and connected funnel insights with RevenueCat subscription data, from first app open to trial conversion.')
bullet('<b>Diagnosed the actual conversion barriers</b>: onboarding completion was strong, while email-OTP sign-up and the paywall caused major losses. Segmented sign-up by method, uncovered a broken social login, and worked with the team on fixes; registration drop-off nearly halved after the improvements.')
bullet('<b>Reframed registration and the paywall around trust</b>: privacy information before health-data entry, separate marketing consent, more relevant sign-in choices, a personalised paywall and four testable trust-signal variants.')
bullet('<b>Supported a freemium product direction</b> based on analytics and user feedback: free symptom tracking, with premium personalised recommendations. Prepared a 90-day growth plan and pricing comparison of six women’s health products for the founders.')
bullet('<b>Designed connected health experiences</b>, including perimenopause period tracking, symptom and sleep logging, AI guidance, journeys, challenges and reports to support more informed discussions with practitioners.')
bullet('Collaborated with founders, clinical advisors and engineers; specified accessible UI states and handoff behaviour for complex wearable/manual data scenarios and helped deliver web updates via GitHub and HTML.')
company('Remedy Product Studio','Jan 2022 – Nov 2024','UI/UX Designer  ·  Healthcare &amp; SaaS product development')
bullet('<b>Owned product design from discovery to delivery</b> for US-focused healthcare products, including user research, competitor analysis, IA, journey maps, wireframes, prototyping, design systems and production handoff.')
bullet('<b>Designed across patient, clinician and administrator experiences</b>: health information, intake, emergency support, consultation and service workflows required clear terminology, accessible UI and careful information hierarchy.')
bullet('<b>Developed reusable systems and cross-team practices</b>; led design reviews, UX workshops and 1:1 mentoring, helping designers, PMs and engineers make consistent UX decisions.')
add('SELECTED REMEDY PROJECTS','kicker')
project('Caraway Health','Oct 2022 – Dec 2023')
compact('<b>End-to-end US digital health platform, not just a student app:</b> designed for a student-facing mobile experience, a clinician/consultant desktop SaaS, and administration and coordination workflows involving doctors, laboratories and care-service providers. All three product areas launched.')
bullet('<b>Designed the shared UX foundations</b> for connected student, clinical and admin workflows, including sign-up, medical history, insurance, telehealth, chat, lab results and recommendations.')
bullet('The student-app scope grew to <b>approximately 240 screens across 20+ flows</b>; designed safety-critical interactions such as pinned crisis resources and clinician response-time/status visibility.')
bullet('Maintained consistency across the patient app, practitioner workspace and SaaS admin as scope grew and <b>two rebrands rolled out over roughly 14 months</b>.')
flow.append(PageBreak())

# Page 3 - selected Remedy outcomes and rest
add('Selected Remedy projects · continued','header');rule()
project('ThePause','May 2024 – Oct 2024')
bullet('<b>Turned repetitive symptom logging into an engaging interaction</b>: replaced a static daily checklist with illustrated, swipeable symptom cards, making symptom check-in the product’s most popular feature, according to product feedback.')
bullet('Partnered with a medical expert on health-data collection and stage-assessment UX; interactive prototypes delivered a <b>30% relative improvement in task accuracy</b> during usability testing.')
project('Remedy Design System 2.0','Dec 2023 – Mar 2024')
bullet('<b>Designed a reusable cross-project system</b> for web and React Native: foundations, responsive components, variants, shared layouts and specifications paired with a developer-built theme constructor.')
bullet('Leadership reported <b>approximately 45% less development time at handoff</b> after rollout, reducing repeated component work and enabling faster rebranding across projects.')
project('Between Health','Sep 2024 – Oct 2024')
compact('Prioritised an extensive feature list into a <b>focused, mobile-first MVP in a few weeks</b> for families and doulas. Designed two distinct onboarding paths, matching and filtering, profiles, contracts and payment settings; delivered a reusable design library and production-ready prototypes for the client team.')
project('She Matters','Jan 2024 – Sep 2024')
compact('Owned concept-to-testing design for a maternal-health experience supporting women with preeclampsia. Mapped emergency-assistance journeys and built a responsive design system, including smartwatch components for time-sensitive interactions.')
section('Earlier experience')
compact('<b>24Eastyard · Project Manager &amp; UX Designer (2019–2020):</b> Owned UX flows, wireframes, prototypes, delivery planning and client communication for smart parking products (UAE) and a two-sided beauty-services platform (Egypt/Jordan).')
compact('<b>Freelance · Web Design &amp; Development (2021):</b> Delivered websites from requirements and research to launch using low-code platforms and connected analytics.')
compact('<b>Seven · UI Designer (2021):</b> Structured Figma design files and healthcare SaaS components; created interactive prototypes and maintained consistent UI states.')
compact('<b>Business Analyst · Various companies (2010–2020):</b> Analysed business processes, data and operational workflows, and customised accounting and office software.')
section('Tools & technology')
compact('<b>Product &amp; research:</b> Figma, FigJam, Miro, Jira, Hotjar, Mixpanel, Google Analytics, Amplitude, RevenueCat.')
compact('<b>Design &amp; delivery:</b> GitHub, Git, VS Code, HTML/CSS, React/Next.js collaboration, WordPress, Elementor, Lottie.')
compact('<b>AI workflows:</b> Claude, ChatGPT, Cursor, Lovable, Midjourney, Higgsfield, AI-assisted prototyping and design-to-code.')
section('Education & certifications')
compact('<b>2026:</b> Google Analytics Certification · Amplitude Practitioner – Acquisition · Mixpanel Fundamentals · Hotjar Certification (Contentsquare).')
compact('<b>UI/UX Design:</b> Beetroot Academy (2021)  ·  <b>HTML, CSS, JavaScript:</b> FreeCodeCamp (2017).')
compact('<b>MA in Economics:</b> Yuriy Fedkovych Chernivtsi National University · Accounting &amp; Business.')

doc=SimpleDocTemplate(FILE,pagesize=A4,rightMargin=14*mm,leftMargin=14*mm,topMargin=15*mm,bottomMargin=21*mm,title='Olesya Levytska - Senior Product Designer CV',author='Olesya Levytska')
doc.build(flow,onFirstPage=frame,onLaterPages=frame)
D=fitz.open(FILE)
print('PDF',FILE,'PAGES',len(D),'SIZE',os.stat(FILE).st_size)
if len(D) != 3:
 raise RuntimeError(f'Expected exactly 3 pages; found {len(D)}')
for p in D:
 spans=[s for b in p.get_text('dict')['blocks'] if 'lines' in b for l in b['lines'] for s in l['spans']]
 ys=[(s['bbox'][1],s['bbox'][3],s['text']) for s in spans]
 print(' PAGE',p.number+1, 'TEXT',len(p.get_text()),'BOTTOM CONTENT',max([a[1] for a in ys if a[1]<810],default=0),'TOP',min([a[0] for a in ys],default=0),'LASTTEXT',p.get_text()[-160:].replace('\n',' | '))
