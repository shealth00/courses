// supabase/seed_pathophysiology.js — populates pathophysiology_topics, the
// symptom-first "given this presenting complaint, what's the differential and
// what's the actual mechanism behind each item" reference (see
// schema_pathophysiology.sql / public/pathophysiology.js). Distinct from
// clinical_topics (disease-first deep-dives, seed_topics.js) and flashcards
// (compact recall cards).
//
// Run with: node supabase/seed_pathophysiology.js
//
// Multiple agents are contributing different symptom clusters to the same
// PATHOPHYSIOLOGY_TOPICS array in parallel. If you're adding a new cluster,
// APPEND your topic objects to the array below rather than replacing it, and
// keep each cluster's entries grouped together with a comment banner so
// merges stay easy to read.
//
// All big-picture framing, exam findings, and DDx/mechanism writing is
// original — not reproduced from any commercial USMLE prep book or question
// bank.
//
// Uses the SERVICE ROLE key (bypasses RLS) — set SUPABASE_SERVICE_KEY in
// your .env before running this. Never run this from the browser or commit
// the key.

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const PATHOPHYSIOLOGY_TOPICS = [
  // ===========================================================================
  // Cluster — GI / Renal / GU
  // ===========================================================================
  {
    slug: 'abdominal-pain',
    title: 'Abdominal Pain',
    system_tag: 'GI/Renal',
    sort_order: 1,

    big_picture:
      'Abdominal pain is best organized first by character — dull, poorly localized visceral pain from a hollow or solid organ versus sharp, well-localized somatic (parietal) pain from irritation of the parietal peritoneum — and then by anatomic location, since each quadrant maps to a fairly predictable set of organs. The pace of onset matters as much as the location: pain that is sudden and severe from the first moment suggests perforation, rupture, torsion, or vascular occlusion, while pain that builds gradually over hours suggests an inflammatory or obstructive process. The most important red flags are peritoneal signs (rigidity, involuntary guarding, rebound tenderness), hemodynamic instability, and pain that is out of proportion to an unimpressive exam, which should raise concern for mesenteric ischemia. Elderly, pregnant, and immunosuppressed patients deserve extra caution, since they can harbor catastrophic intra-abdominal pathology behind a deceptively benign-looking exam.',

    exam_findings:
      'Rebound tenderness, involuntary guarding, or board-like rigidity → peritonitis from perforation or rupture\nPositive psoas sign (pain with hip extension, or flexion against resistance) → retrocecal appendicitis or psoas abscess\nPositive obturator sign (pain with internal rotation of the flexed hip) → pelvic appendicitis or a pelvic abscess\nMurphy sign (inspiratory arrest on right upper quadrant palpation) → acute cholecystitis\nRovsing sign (palpating the left lower quadrant produces right lower quadrant pain) → appendicitis\nCullen sign (periumbilical ecchymosis) or Grey Turner sign (flank ecchymosis) → retroperitoneal or hemorrhagic pancreatic bleeding\nPain markedly out of proportion to a soft, minimally tender abdomen → mesenteric ischemia\nCostovertebral angle tenderness → pyelonephritis or an obstructing renal stone',

    ddx: [
      {
        condition: 'Acute appendicitis',
        key_features:
          'Pain beginning periumbilically and migrating over hours to the right lower quadrant (McBurney point), anorexia, low-grade fever, positive Rovsing/psoas/obturator signs, mild leukocytosis.',
        mechanism:
          'Luminal obstruction of the appendix (fecalith or lymphoid hyperplasia) causes progressive distension, impaired venous outflow, bacterial overgrowth, and wall ischemia. Early distension produces poorly localized visceral pain referred to the periumbilical region via afferents entering the spinal cord at T10; once transmural inflammation reaches the adjacent parietal peritoneum, the pain becomes sharp and localizes to the right lower quadrant.',
      },
      {
        condition: 'Acute cholecystitis',
        key_features:
          'Right upper quadrant pain after a fatty meal, positive Murphy sign, fever and leukocytosis, ultrasound showing gallbladder wall thickening or pericholecystic fluid with a stone at the cystic duct.',
        mechanism:
          'A gallstone obstructs the cystic duct, causing gallbladder distension and rising intraluminal pressure that impairs mucosal blood flow. The resulting ischemia and secondary bacterial infection inflame the gallbladder wall, which irritates the overlying parietal peritoneum and produces localized, sharp right upper quadrant pain.',
      },
      {
        condition: 'Acute pancreatitis',
        key_features:
          'Severe, steady epigastric pain radiating to the back, worse lying supine and improved leaning forward, prominent nausea and vomiting, markedly elevated lipase, history of gallstones or heavy alcohol use.',
        mechanism:
          'Premature intra-acinar activation of trypsinogen to trypsin triggers autodigestion of pancreatic tissue by its own proteolytic and lipolytic enzymes. The resulting local inflammation, edema, and (in severe cases) fat necrosis and hemorrhage irritate the richly innervated, retroperitoneal pancreatic bed, producing deep, boring pain that radiates to the back.',
      },
      {
        condition: 'Mechanical small bowel obstruction',
        key_features:
          'Colicky, intermittent periumbilical pain in waves, abdominal distension, high-pitched or hyperactive early bowel sounds, obstipation, vomiting, often a history of prior abdominal surgery (adhesions).',
        mechanism:
          'A mechanical blockage (adhesions, hernia, or tumor) traps gas and fluid proximally, dilating the bowel wall and raising intraluminal pressure. Peristaltic smooth muscle contractions against the fixed obstruction produce crampy, colicky visceral pain; if the obstruction compromises the bowel wall’s blood supply (strangulation), pain becomes constant and peritoneal signs develop.',
      },
      {
        condition: 'Acute mesenteric ischemia',
        key_features:
          'Severe, poorly localized pain that is strikingly out of proportion to a soft, non-tender abdominal exam; history of atrial fibrillation or diffuse atherosclerosis; metabolic acidosis and elevated lactate.',
        mechanism:
          'Embolic or thrombotic occlusion of a mesenteric vessel (or a low-flow, nonocclusive state) deprives the bowel wall of oxygen. Ischemic tissue releases anaerobic metabolites and inflammatory mediators that intensely activate visceral nociceptors well before the bowel wall becomes frankly necrotic and peritoneal signs appear — the source of the classic pain-exam mismatch.',
      },
      {
        condition: 'Acute diverticulitis',
        key_features:
          'Left lower quadrant pain (sigmoid colon), fever, leukocytosis, a change in bowel habits, CT showing diverticular wall thickening with surrounding fat stranding.',
        mechanism:
          'A colonic diverticulum (an outpouching through the muscular wall at a point where the vasa recta penetrate it) becomes obstructed by inspissated fecal material, allowing bacterial proliferation and localized micro-perforation. The resulting pericolic inflammation irritates the adjacent parietal peritoneum over the sigmoid colon, producing focal left lower quadrant pain.',
      },
      {
        condition: 'Ruptured or rapidly expanding abdominal aortic aneurysm',
        key_features:
          'Sudden, severe abdominal or back pain, a pulsatile abdominal mass, hypotension or syncope, known risk factors (older age, smoking, hypertension, prior aneurysm).',
        mechanism:
          'Degeneration of elastin and collagen in the aortic media progressively weakens the vessel wall, allowing dilation over time. Rupture releases blood into the retroperitoneum, acutely stretching the peritoneum, retroperitoneal structures, and nerve plexuses, producing sudden severe pain, while ongoing hemorrhage drives hypotension.',
      },
      {
        condition: 'Nephrolithiasis (renal colic)',
        key_features:
          'Sudden, severe flank pain radiating to the groin, gross or microscopic hematuria, a patient who is writhing and unable to find a comfortable position (in contrast to the stillness of peritonitis), costovertebral angle tenderness.',
        mechanism:
          'A stone lodges in the ureter, causing acute obstruction and distension of the collecting system and ureter proximal to it. The resulting stretch of the renal capsule and ureteral wall activates visceral afferents that travel alongside sympathetic fibers to spinal levels T11–L2, while peristaltic waves attempting to move the stone produce the classic colicky, wave-like flank-to-groin pain.',
      },
    ],
  },

  {
    slug: 'jaundice',
    title: 'Jaundice',
    system_tag: 'GI/Renal',
    sort_order: 2,

    big_picture:
      'Jaundice reflects hyperbilirubinemia and is most efficiently approached by asking where in the bilirubin pathway the problem lies: prehepatic (overproduction, usually hemolysis, with unconjugated hyperbilirubinemia and normal liver enzymes), hepatic (impaired hepatocyte uptake, conjugation, or excretion, with a mixed picture and elevated transaminases), or posthepatic/obstructive (blocked bile flow after conjugation, with conjugated hyperbilirubinemia and a cholestatic enzyme pattern). Fractionating the bilirubin and pairing it with the liver enzyme pattern narrows the category before any imaging is needed. The key red flags are signs of fulminant hepatic failure (coagulopathy, encephalopathy), the Charcot triad of fever, jaundice, and right upper quadrant pain that signals ascending cholangitis (a biliary emergency), and painless jaundice with a palpable, nontender gallbladder (Courvoisier sign), which points toward malignant obstruction rather than a stone.',

    exam_findings:
      'Scleral icterus and skin jaundice severity → tracks the bilirubin level itself, not the underlying mechanism\nSpider angiomata, palmar erythema, caput medusae, gynecomastia → chronic liver disease with portal hypertension\nTender hepatomegaly → acute hepatitis or acute hepatic congestion\nNontender, palpable gallbladder (Courvoisier sign) → malignant distal biliary obstruction (e.g., pancreatic head cancer) rather than gallstone disease\nCharcot triad (fever, jaundice, right upper quadrant pain) → ascending cholangitis\nAsterixis and altered mental status → hepatic encephalopathy from decompensated liver failure\nSplenomegaly → portal hypertension or an underlying hemolytic process\nDark urine with pale, acholic stools → conjugated hyperbilirubinemia from biliary obstruction',

    ddx: [
      {
        condition: 'Hemolytic anemia (prehepatic)',
        key_features:
          'Predominantly indirect (unconjugated) hyperbilirubinemia, elevated LDH, low haptoglobin, reticulocytosis, normal liver enzymes, and possibly splenomegaly.',
        mechanism:
          'Accelerated red blood cell destruction (intravascular or extravascular) releases heme faster than it can be catabolized and conjugated. Unconjugated bilirubin production overwhelms the liver’s conjugating capacity (UDP-glucuronosyltransferase, UGT1A1), so unconjugated bilirubin rises disproportionately to conjugated bilirubin.',
      },
      {
        condition: 'Gilbert syndrome',
        key_features:
          'Mild, intermittent unconjugated hyperbilirubinemia that worsens with fasting, illness, or stress; normal liver enzymes and no evidence of hemolysis; an entirely benign course.',
        mechanism:
          'A promoter polymorphism reduces the activity of UGT1A1, the enzyme responsible for conjugating bilirubin with glucuronic acid. Mildly impaired conjugation causes intermittent, low-grade unconjugated hyperbilirubinemia without any underlying hepatocyte injury.',
      },
      {
        condition: 'Acute viral hepatitis (A, B, or C)',
        key_features:
          'A prodrome of malaise, nausea, and anorexia, marked transaminase elevation, relevant exposure history (travel, injection drug use, sexual contact), and a mixed hyperbilirubinemia.',
        mechanism:
          'Direct viral cytopathic injury and cytotoxic T-cell-mediated destruction of infected hepatocytes impair bilirubin uptake, conjugation, and canalicular excretion simultaneously. The combined defect produces a mixed hyperbilirubinemia alongside a hepatocellular pattern of markedly elevated aminotransferases.',
      },
      {
        condition: 'Alcoholic hepatitis',
        key_features:
          'An AST:ALT ratio greater than 2:1 with both values usually under 400, a history of heavy alcohol use, tender hepatomegaly, and disproportionately elevated GGT.',
        mechanism:
          'Ethanol metabolism through alcohol and aldehyde dehydrogenase generates acetaldehyde and shifts the hepatocyte’s redox state toward excess NADH, causing mitochondrial dysfunction, steatosis, and direct hepatocyte injury. This impairs bilirubin processing and bile canalicular transport, producing a mixed hyperbilirubinemia superimposed on hepatocellular injury.',
      },
      {
        condition: 'Choledocholithiasis',
        key_features:
          'Right upper quadrant or epigastric pain, conjugated hyperbilirubinemia with elevated alkaline phosphatase and GGT, and a dilated common bile duct on ultrasound, often with known gallstones.',
        mechanism:
          'A gallstone migrates out of the gallbladder and obstructs the common bile duct, blocking the outflow of bile that hepatocytes have already conjugated and excreted into the canaliculi. Rising pressure in the obstructed biliary tree forces conjugated bilirubin back across disrupted tight junctions into the bloodstream.',
      },
      {
        condition: 'Pancreatic head adenocarcinoma',
        key_features:
          'Painless, progressively worsening jaundice, unintentional weight loss, a palpable nontender gallbladder (Courvoisier sign), and sometimes new-onset atypical diabetes.',
        mechanism:
          'A tumor arising in the head of the pancreas compresses or invades the adjacent intrapancreatic common bile duct, causing gradual extrinsic obstruction. Because the gallbladder and cystic duct are otherwise normal (unlike in stone disease, which scars the gallbladder over time), the gallbladder distends smoothly and remains palpable but nontender as conjugated bilirubin steadily rises.',
      },
      {
        condition: 'Primary sclerosing cholangitis',
        key_features:
          'A chronic cholestatic enzyme pattern (disproportionately elevated alkaline phosphatase), a strong association with ulcerative colitis, and a "beaded" appearance of the bile ducts on cholangiography.',
        mechanism:
          'An immune-mediated process causes periductal fibrosis and inflammation of the intrahepatic and extrahepatic bile ducts, producing multifocal strictures alternating with dilations. The resulting irregular narrowing progressively impairs bile flow, producing conjugated hyperbilirubinemia and cholestasis as the disease advances.',
      },
      {
        condition: 'Ascending cholangitis',
        key_features:
          'The Charcot triad of fever, right upper quadrant pain, and jaundice, usually developing on top of an existing obstructing common bile duct stone; may progress to hypotension and altered mental status (Reynolds pentad).',
        mechanism:
          'Bacteria ascend from the duodenum into a biliary tree that is obstructed and stagnant (typically from a retained common bile duct stone), establishing a suppurative infection under pressure. Ongoing obstruction and inflammation of the bile ducts further impair bile excretion, raising conjugated bilirubin, while the infection itself carries a high risk of bacteremia and sepsis.',
      },
    ],
  },

  {
    slug: 'hematuria',
    title: 'Hematuria',
    system_tag: 'GI/Renal',
    sort_order: 3,

    big_picture:
      'Hematuria splits first into glomerular (dysmorphic red cells, red cell casts, and often proteinuria, pointing to a glomerulonephritis) versus non-glomerular/urologic (normal-appearing red cells, pointing to stones, infection, structural lesions, or tumor), and second into gross versus microscopic. Where in the urinary stream the blood appears — initial, terminal, or throughout — can further localize the source to the urethra, the bladder neck or prostate, or the upper tract/bladder respectively. The single most important red flag is painless gross hematuria in an adult, particularly a smoker or someone over 35–40, which must be assumed to be urothelial malignancy until cystoscopy and upper-tract imaging prove otherwise. Associated flank pain, fever, or a rapid rise in creatinine changes the urgency and direction of the workup considerably.',

    exam_findings:
      'Costovertebral angle tenderness → pyelonephritis or an obstructing renal stone\nSuprapubic tenderness → cystitis\nPalpable flank mass → renal cell carcinoma or polycystic kidney disease\nHypertension with periorbital or peripheral edema → glomerulonephritis (nephritic syndrome)\nEnlarged, nodular, asymmetric prostate on digital rectal exam → prostate cancer\nInitial hematuria (blood at the start of the stream that then clears) → a urethral source\nTerminal hematuria (blood at the end of the stream) → a bladder neck or prostatic source\nTotal hematuria present throughout the stream → an upper tract (renal) or diffuse bladder source',

    ddx: [
      {
        condition: 'Nephrolithiasis',
        key_features:
          'Gross or microscopic hematuria with colicky flank pain radiating to the groin, normal-appearing (non-dysmorphic) red cells, a stone visible on non-contrast CT.',
        mechanism:
          'A stone traversing or lodged in the urinary tract mechanically abrades the urothelium as it moves, while the accompanying obstruction raises intraluminal pressure and further injures the mucosa, both of which release red cells into the urine.',
      },
      {
        condition: 'Acute cystitis / urinary tract infection',
        key_features:
          'Dysuria, urinary urgency and frequency, suprapubic discomfort, and usually microscopic hematuria accompanied by pyuria and bacteriuria on urinalysis.',
        mechanism:
          'Bacterial invasion of the bladder mucosa provokes an acute neutrophilic inflammatory response with mucosal capillary injury and superficial erosion, allowing red blood cells to leak into the urine alongside white cells and bacteria.',
      },
      {
        condition: 'Bladder urothelial carcinoma',
        key_features:
          'Painless, often intermittent gross hematuria in an older patient with a smoking history; no proteinuria or dysmorphic red cells; a mass identified on cystoscopy.',
        mechanism:
          'Malignant urothelial cells form a disorganized, hypervascular tumor surface that lacks the normal protective mucosal architecture. This friable surface bleeds spontaneously with only the minor trauma of normal urine flow across it.',
      },
      {
        condition: 'Renal cell carcinoma',
        key_features:
          'May present with only painless hematuria, or with the classic (though uncommon when all three occur together) triad of flank pain, a palpable mass, and hematuria; occasionally accompanied by paraneoplastic polycythemia from ectopic erythropoietin.',
        mechanism:
          'The tumor invades or protrudes into the renal collecting system, and its disorganized neovasculature is structurally fragile, allowing direct hemorrhage from the tumor surface into the urinary tract.',
      },
      {
        condition: 'IgA nephropathy',
        key_features:
          'Gross hematuria appearing one to two days after an upper respiratory or gastrointestinal infection ("synpharyngitic" hematuria), often recurrent, with dysmorphic red cells or red cell casts and normal or mildly elevated creatinine.',
        mechanism:
          'Poorly O-glycosylated IgA1-containing immune complexes deposit in the glomerular mesangium, activating complement and driving mesangial cell proliferation. The resulting disruption of the glomerular capillary wall allows red cells to enter the urinary space, becoming distorted (dysmorphic) as they pass through the damaged basement membrane and tubular system.',
      },
      {
        condition: 'Benign prostatic hyperplasia',
        key_features:
          'An older man with lower urinary tract symptoms (weak stream, hesitancy, nocturia), microscopic or occasionally gross hematuria, and a diffusely enlarged, smooth prostate on exam.',
        mechanism:
          'Hyperplastic prostatic tissue compresses the urethra and congests the periurethral venous plexus and prostatic mucosa. The increased vascularity of hyperplastic tissue, combined with mechanical straining to void, can rupture small submucosal vessels and produce hematuria.',
      },
      {
        condition: 'Post-streptococcal glomerulonephritis',
        key_features:
          'A child with cola-colored urine, periorbital edema, and hypertension appearing one to three weeks after a group A streptococcal pharyngitis or skin infection, with a low serum C3.',
        mechanism:
          'Immune complexes containing streptococcal antigens deposit in the subepithelial space of the glomerular basement membrane, triggering complement activation and a neutrophilic inflammatory response. The resulting disruption of the capillary wall allows red cells and protein to leak into the tubular fluid.',
      },
      {
        condition: 'Autosomal dominant polycystic kidney disease',
        key_features:
          'A family history of the disease, bilateral flank masses, hypertension, and episodic gross hematuria from cyst rupture or hemorrhage, often with associated intracranial (berry) aneurysms.',
        mechanism:
          'Mutations in PKD1 or PKD2 disrupt polycystin-mediated tubular epithelial signaling, driving progressive cyst formation throughout the renal parenchyma. Vessels within cyst walls are prone to rupture, or cysts themselves can hemorrhage into the collecting system, releasing blood into the urine.',
      },
    ],
  },

  {
    slug: 'dysuria',
    title: 'Dysuria',
    system_tag: 'GI/Renal',
    sort_order: 4,

    big_picture:
      'Dysuria — pain or burning with urination — most often signals mucosal irritation somewhere along the lower urinary tract, so the first branch point is infectious versus non-infectious, and within infectious causes, whether the process is confined to the bladder or urethra versus having ascended to the kidney or prostate. In women it is also worth distinguishing true urinary-source (internal) dysuria from external dysuria caused by urine passing over inflamed vulvovaginal tissue, since the workup and treatment differ completely. Red flags that change management include fever, flank pain, or systemic toxicity suggesting pyelonephritis or prostatitis rather than simple cystitis; dysuria in a man, where uncomplicated cystitis is uncommon and prostatitis or a sexually transmitted infection should be considered; and chronic dysuria with persistently negative cultures, which raises interstitial cystitis or another non-bacterial cause.',

    exam_findings:
      'Suprapubic tenderness → cystitis\nCostovertebral angle tenderness with fever → pyelonephritis (upper tract involvement)\nExquisitely tender, boggy prostate on digital rectal exam → acute bacterial prostatitis (perform the exam gently, since vigorous prostatic massage can precipitate bacteremia)\nUrethral discharge → urethritis, gonococcal or chlamydial\nVulvovaginal erythema and discharge without urinary frequency or urgency → vaginitis mimicking true dysuria\nHigh fever, vomiting, and marked costovertebral tenderness → complicated or severe pyelonephritis\nExternal genital ulcers or vesicles → herpes simplex infection\nA normal pelvic or genital exam with persistent symptoms and repeatedly negative cultures → interstitial cystitis/bladder pain syndrome',

    ddx: [
      {
        condition: 'Acute uncomplicated cystitis',
        key_features:
          'Dysuria, urgency, and frequency with suprapubic discomfort but no fever or flank pain; pyuria and bacteriuria on urinalysis; typically a sexually active woman.',
        mechanism:
          'Uropathogenic bacteria, most commonly E. coli using P-fimbriae, ascend the urethra and adhere to and invade the bladder urothelium. The resulting inflammatory response sensitizes bladder and urethral nociceptors, producing pain with the mechanical stretch and flow of voiding.',
      },
      {
        condition: 'Acute pyelonephritis',
        key_features:
          'Dysuria plus fever, chills, and flank pain, with costovertebral angle tenderness and pyuria that includes white cell casts on urinalysis.',
        mechanism:
          'Infection ascends from the bladder (or occasionally arrives hematogenously) to reach the renal pelvis and parenchyma, producing interstitial inflammation and edema. Alongside the systemic infectious process, ongoing lower urinary tract mucosal irritation from the ascending infection continues to contribute to dysuria.',
      },
      {
        condition: 'Chlamydial urethritis',
        key_features:
          'Dysuria with scant, mucoid discharge that is often subtler than gonococcal infection, frequently asymptomatic in women, positive on nucleic acid amplification testing.',
        mechanism:
          'Chlamydia trachomatis, an obligate intracellular organism, infects urethral columnar epithelial cells and provokes a predominantly lymphocytic and monocytic inflammatory response. This produces urethral mucosal irritation and pain with urination that is generally milder than the brisk neutrophilic response seen with gonorrhea.',
      },
      {
        condition: 'Gonococcal urethritis',
        key_features:
          'Dysuria with copious purulent urethral discharge and rapid onset (two to five days after exposure); Gram-negative intracellular diplococci seen on Gram stain of the discharge.',
        mechanism:
          'Neisseria gonorrhoeae directly invades urethral epithelial cells, triggering an intense neutrophilic inflammatory response. The resulting purulent exudate and marked mucosal irritation produce pronounced pain with voiding.',
      },
      {
        condition: 'Acute bacterial prostatitis',
        key_features:
          'Dysuria with perineal or suprapubic pain, fever and chills, and an exquisitely tender, boggy prostate on exam, often in a man with recent urethral instrumentation or a preceding urinary tract infection.',
        mechanism:
          'Bacteria, usually ascending from the urethra or bladder, infect the prostate gland and cause acute glandular inflammation and edema. The swollen gland compresses the prostatic urethra and irritates surrounding tissue, producing pain referred to the perineum as well as pain with urination.',
      },
      {
        condition: 'Vulvovaginal candidiasis',
        key_features:
          'External dysuria — burning as urine passes over inflamed labia rather than true bladder-source pain — with thick, curdy discharge and pruritus; no true frequency or urgency; urine culture negative.',
        mechanism:
          'Overgrowth of Candida causes inflammation and excoriation of the vulvovaginal mucosa. When urine subsequently contacts this inflamed external tissue during voiding, it produces a burning sensation that mimics true urinary dysuria despite the bladder itself being entirely uninvolved.',
      },
      {
        condition: 'Interstitial cystitis / bladder pain syndrome',
        key_features:
          'Chronic dysuria and suprapubic pain with urgency and frequency lasting more than six weeks, worsening as the bladder fills and improving after voiding, with repeatedly negative urine cultures; cystoscopy may show glomerulations or Hunner lesions.',
        mechanism:
          'A defective urothelial glycosaminoglycan layer allows urinary solutes, particularly potassium, to leak into the bladder submucosa. This activates sensory nerve fibers and resident mast cells, producing chronic neurogenic bladder-wall inflammation and pain independent of any infection.',
      },
      {
        condition: 'Genital herpes simplex infection',
        key_features:
          'Often severe external dysuria from urine contacting painful vesicles or ulcers on the genitalia, tender inguinal lymphadenopathy, and in severe cases urinary retention from pain-related voiding avoidance.',
        mechanism:
          'HSV replicates within genital and perigenital epithelial cells, causing cytolysis and the formation of painful vesicles that rupture into ulcers. Urination over these denuded, richly innervated areas directly activates exposed nerve endings, producing intense external dysuria.',
      },
    ],
  },

  {
    slug: 'nausea-vomiting',
    title: 'Nausea and Vomiting',
    system_tag: 'GI/Renal',
    sort_order: 5,

    big_picture:
      'Nausea and vomiting are produced by a shared final common pathway — the medullary vomiting center and the chemoreceptor trigger zone in the area postrema — that can be activated by GI tract irritation or obstruction, vestibular input, direct central nervous system pathology, metabolic or endocrine derangements, drugs and toxins, or pregnancy. The most useful initial distinctions are whether vomiting is accompanied by abdominal pain (favoring a surgical or obstructive process) and whether the course is acute or chronic. Red flags that change the urgency of the workup include bilious or feculent vomiting (suggesting mechanical obstruction), hematemesis, early-morning vomiting with little preceding nausea and an accompanying headache or papilledema (suggesting raised intracranial pressure), and a positive pregnancy test in any woman of reproductive age presenting with new vomiting.',

    exam_findings:
      'Succussion splash on abdominal exam → gastric outlet obstruction or retained gastric contents\nHigh-pitched, hyperactive bowel sounds early, or a silent abdomen later → mechanical bowel obstruction or ileus\nPapilledema or focal neurologic deficits → increased intracranial pressure or a mass lesion\nNystagmus with a positive Dix-Hallpike maneuver → a vestibular cause\nAbdominal distension with tympany to percussion → obstruction or ileus\nEpigastric tenderness → gastritis or peptic ulcer disease\nDry mucous membranes, tachycardia, and poor skin turgor → a marker of dehydration severity regardless of the underlying cause\nFruity breath odor with Kussmaul respirations → diabetic ketoacidosis',

    ddx: [
      {
        condition: 'Viral gastroenteritis',
        key_features:
          'Acute-onset nausea and vomiting with watery diarrhea, diffuse crampy abdominal pain, low-grade fever, sick contacts, and a self-limited course.',
        mechanism:
          'Viral infection (e.g., norovirus, rotavirus) injures small intestinal enterocytes and disrupts normal fluid and electrolyte transport. Local release of inflammatory mediators and serotonin from enterochromaffin cells stimulates vagal afferents that signal directly to the medullary vomiting center.',
      },
      {
        condition: 'Mechanical bowel obstruction',
        key_features:
          'Bilious vomiting (proximal obstruction) or feculent, foul-smelling vomiting (distal, late obstruction), colicky abdominal pain, distension, and obstipation, often with a history of prior abdominal surgery or hernia.',
        mechanism:
          'A mechanical blockage causes proximal bowel distension and rising luminal pressure; the distension itself activates mechanoreceptors that signal via vagal and spinal afferents to the vomiting center, while retrograde peristalsis expels the accumulated proximal contents.',
      },
      {
        condition: 'Diabetic ketoacidosis',
        key_features:
          'Nausea and vomiting with polyuria, polydipsia, diffuse abdominal pain, Kussmaul respirations, and a fruity breath odor, with hyperglycemia, an anion-gap metabolic acidosis, and ketosis.',
        mechanism:
          'Absolute or relative insulin deficiency drives unrestrained lipolysis and hepatic ketogenesis. The circulating ketoacids and metabolic derangement directly stimulate the chemoreceptor trigger zone in the area postrema, which lacks a complete blood-brain barrier and senses circulating toxins and metabolites, triggering nausea and vomiting.',
      },
      {
        condition: 'Increased intracranial pressure (mass lesion or hemorrhage)',
        key_features:
          'Early-morning, often projectile vomiting with little preceding nausea, an associated headache that worsens with Valsalva maneuvers, papilledema, and focal neurologic deficits.',
        mechanism:
          'Elevated intracranial pressure or direct mass effect acts on the area postrema and adjacent dorsal vagal complex in the medulla, directly triggering the vomiting center. This bypasses the gradual buildup of nausea typically produced by GI-mediated vomiting, which is why vomiting can precede or occur without significant preceding nausea.',
      },
      {
        condition: 'Hyperemesis gravidarum',
        key_features:
          'Persistent, severe nausea and vomiting in the first trimester causing more than five percent body weight loss and dehydration or electrolyte disturbance, often with markedly elevated hCG (e.g., multiple gestation, molar pregnancy).',
        mechanism:
          'Rapidly rising human chorionic gonadotropin and estrogen levels are thought to directly stimulate the chemoreceptor trigger zone and slow gastric motility, producing nausea and vomiting well beyond the degree of typical early-pregnancy "morning sickness."',
      },
      {
        condition: 'Vestibular neuritis',
        key_features:
          'Acute, severe vertigo with prominent nausea and vomiting, nystagmus, and gait instability, frequently following a viral illness, with no other focal neurologic deficits and an abnormal head impulse test.',
        mechanism:
          'Inflammation of the vestibular nerve generates an asymmetric, erroneous signal of movement to the vestibular nuclei. This mismatched vestibular input is relayed to the medullary emetic pathways via connections between the vestibular nuclei and the vomiting center, producing nausea and vomiting alongside vertigo.',
      },
      {
        condition: 'Opioid- or chemotherapy-induced nausea',
        key_features:
          'Nausea and vomiting with a clear temporal relationship to a new or dose-escalated medication (opioids, cisplatin and other chemotherapeutic agents), resolving with dose adjustment, antiemetics, or discontinuation.',
        mechanism:
          'Opioids and many chemotherapeutic agents directly stimulate dopamine (D2) and serotonin (5-HT3) receptors in the chemoreceptor trigger zone; opioids additionally slow gastric emptying. Both effects converge on the same emetic pathway to trigger the vomiting reflex.',
      },
      {
        condition: 'Uremia (advanced chronic kidney disease)',
        key_features:
          'Nausea and vomiting with anorexia, fatigue, and pruritus, markedly elevated BUN and creatinine, and sometimes a metallic taste or uremic fetor.',
        mechanism:
          'Accumulation of nitrogenous waste products and other uremic toxins that the failing kidney can no longer clear directly stimulates the chemoreceptor trigger zone, and also produces uremic gastritis and enteritis, both of which contribute to persistent nausea and vomiting.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Insert
// ---------------------------------------------------------------------------

async function upsertPathophysiologyTopics(supabase) {
  const rows = PATHOPHYSIOLOGY_TOPICS.map((t) => ({
    slug: t.slug,
    title: t.title,
    system_tag: t.system_tag,
    sort_order: t.sort_order,
    big_picture: t.big_picture,
    exam_findings: t.exam_findings,
    ddx: t.ddx,
  }));

  const { data, error } = await supabase
    .from('pathophysiology_topics')
    .upsert(rows, { onConflict: 'slug' })
    .select();
  if (error) throw error;
  console.log(`Upserted ${data.length} pathophysiology_topics row(s).`);
  return data;
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in your .env.\n' +
      'Get the service_role key from Supabase: Project Settings > API > service_role (secret).\n' +
      'This key is server-only — never expose it to the browser.'
    );
    process.exit(1);
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  console.log('Seeding pathophysiology_topics...');
  await upsertPathophysiologyTopics(supabase);
  console.log('Done.');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

module.exports = { PATHOPHYSIOLOGY_TOPICS, upsertPathophysiologyTopics };
