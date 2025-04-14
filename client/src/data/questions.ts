export const questions = [
  // Biology questions - Cell Structure & Function (Test 1)
  {
    id: 1,
    subjectId: "biology",
    chapterId: "cell-the-unit-of-life",
    testId: 1,
    questionText: "Which of the following organelles is responsible for protein synthesis in eukaryotic cells?",
    options: [
      "Mitochondria",
      "Ribosomes",
      "Lysosomes",
      "Golgi apparatus"
    ],
    correctOptionIndex: 1,
    selectedOptionIndex: 1,
    explanation: "Ribosomes are the cellular organelles responsible for protein synthesis in both prokaryotic and eukaryotic cells. They consist of ribosomal RNA (rRNA) and proteins, and can be found floating freely in the cytoplasm or attached to the endoplasmic reticulum."
  },
  {
    id: 2,
    subjectId: "biology",
    chapterId: "cell-the-unit-of-life",
    testId: 1,
    questionText: "Which of the following is NOT a function of the cell membrane?",
    options: [
      "Transport of materials",
      "Cell recognition",
      "Energy production",
      "Protection of cell contents"
    ],
    correctOptionIndex: 2,
    selectedOptionIndex: null,
    explanation: "Energy production primarily occurs in mitochondria through cellular respiration, not in the cell membrane. The cell membrane functions include transport of materials, cell recognition, protection, and maintenance of cell shape."
  },
  {
    id: 3,
    subjectId: "biology",
    chapterId: "cell-the-unit-of-life",
    testId: 1,
    questionText: "Which of the following organelles is known as the 'powerhouse of the cell'?",
    options: [
      "Endoplasmic reticulum",
      "Golgi apparatus",
      "Mitochondria",
      "Lysosome"
    ],
    correctOptionIndex: 2,
    selectedOptionIndex: null,
    explanation: "Mitochondria are known as the 'powerhouse of the cell' because they generate most of the cell's supply of ATP (adenosine triphosphate), which is used as a source of chemical energy."
  },
  {
    id: 4,
    subjectId: "biology",
    chapterId: "cell-the-unit-of-life",
    testId: 1,
    questionText: "Which cellular organelle is responsible for detoxification of drugs and poisons in liver cells?",
    options: [
      "Smooth endoplasmic reticulum",
      "Rough endoplasmic reticulum",
      "Golgi apparatus",
      "Peroxisomes"
    ],
    correctOptionIndex: 0,
    selectedOptionIndex: null,
    explanation: "Smooth endoplasmic reticulum (SER) is involved in detoxification of drugs and poisons, especially in liver cells. It contains enzymes that catalyze reactions to detoxify harmful substances."
  },
  {
    id: 5,
    subjectId: "biology",
    chapterId: "cell-the-unit-of-life",
    testId: 1,
    questionText: "The fluid mosaic model of plasma membrane was proposed by:",
    options: [
      "Robert Hooke",
      "Singer and Nicolson",
      "Robert Brown",
      "Schleiden and Schwann"
    ],
    correctOptionIndex: 1,
    selectedOptionIndex: null,
    explanation: "The fluid mosaic model of plasma membrane was proposed by S.J. Singer and G.L. Nicolson in 1972. This model describes the structure of the cell membrane as a mosaic of components including phospholipids, cholesterol, proteins, and carbohydrates that gives the membrane a fluid character."
  },

  // Physics questions - Motion in a Straight Line (Test 1)
  {
    id: 101,
    subjectId: "physics",
    chapterId: "motion-in-a-straight-line",
    testId: 1,
    questionText: "A body moving with uniform acceleration has velocity 10 m/s at time t = 0. After 5 seconds, its velocity becomes 20 m/s. What is its acceleration?",
    options: [
      "1 m/s²",
      "2 m/s²",
      "5 m/s²",
      "10 m/s²"
    ],
    correctOptionIndex: 1,
    selectedOptionIndex: null,
    explanation: "Using the equation v = u + at, where v is final velocity, u is initial velocity, a is acceleration, and t is time. Substituting given values: 20 = 10 + a × 5, which gives a = 2 m/s²."
  },
  {
    id: 102,
    subjectId: "physics",
    chapterId: "motion-in-a-straight-line",
    testId: 1,
    questionText: "A car accelerates uniformly from rest to a speed of 72 km/h in 10 seconds. Calculate the distance traveled during this time.",
    options: [
      "100 m",
      "200 m",
      "360 m",
      "720 m"
    ],
    correctOptionIndex: 0,
    selectedOptionIndex: null,
    explanation: "First convert 72 km/h to m/s: 72 × (5/18) = 20 m/s. Using the equation s = ut + (1/2)at², where u = 0 (rest), t = 10s, and a = 20/10 = 2 m/s². So, s = 0 + (1/2) × 2 × 100 = 100 m."
  },
  {
    id: 103,
    subjectId: "physics",
    chapterId: "motion-in-a-straight-line",
    testId: 1,
    questionText: "For a particle in uniform motion, which of these parameters remains constant?",
    options: [
      "Displacement",
      "Speed",
      "Acceleration",
      "Both B and C"
    ],
    correctOptionIndex: 1,
    selectedOptionIndex: null,
    explanation: "In uniform motion, speed remains constant. Displacement continuously changes as the particle moves. Acceleration is zero in uniform motion, but the question asks about what 'remains constant', not what 'equals zero'."
  },
  {
    id: 104,
    subjectId: "physics",
    chapterId: "motion-in-a-straight-line",
    testId: 1,
    questionText: "An object is thrown vertically upward with a velocity of 19.6 m/s. What is the maximum height reached by the object? (Take g = 9.8 m/s²)",
    options: [
      "10 m",
      "19.6 m",
      "20 m",
      "39.2 m"
    ],
    correctOptionIndex: 2,
    selectedOptionIndex: null,
    explanation: "Using the equation v² = u² - 2gh, where v = 0 at maximum height, u = 19.6 m/s, and g = 9.8 m/s². Rearranging, h = u²/2g = (19.6)²/(2 × 9.8) = 384.16/19.6 = 20 m."
  },
  {
    id: 105,
    subjectId: "physics",
    chapterId: "motion-in-a-straight-line",
    testId: 1,
    questionText: "The displacement-time graph of a particle is a straight line parallel to the time axis. What does this represent?",
    options: [
      "Object is at rest",
      "Object is moving with uniform velocity",
      "Object is moving with uniform acceleration",
      "Object is moving with non-uniform acceleration"
    ],
    correctOptionIndex: 0,
    selectedOptionIndex: null,
    explanation: "If the displacement-time graph is a straight line parallel to the time axis, it means the displacement remains constant over time, which indicates that the object is at rest (not moving)."
  },

  // Chemistry questions - Chemical Bonding (Test 1)
  {
    id: 201,
    subjectId: "chemistry",
    chapterId: "chemical-bonding",
    testId: 1,
    questionText: "Which of the following molecules has a linear shape according to VSEPR theory?",
    options: [
      "H₂O",
      "NH₃",
      "CO₂",
      "CH₄"
    ],
    correctOptionIndex: 2,
    selectedOptionIndex: null,
    explanation: "CO₂ (carbon dioxide) has a linear shape according to VSEPR theory because the central carbon atom has two double bonds with oxygen atoms at 180° angles. H₂O is bent, NH₃ is pyramidal, and CH₄ is tetrahedral."
  },
  {
    id: 202,
    subjectId: "chemistry",
    chapterId: "chemical-bonding",
    testId: 1,
    questionText: "Which type of bond is formed when electrons are transferred from one atom to another?",
    options: [
      "Covalent bond",
      "Metallic bond",
      "Ionic bond",
      "Hydrogen bond"
    ],
    correctOptionIndex: 2,
    selectedOptionIndex: null,
    explanation: "An ionic bond is formed when electrons are transferred from one atom (typically a metal) to another atom (typically a non-metal), resulting in positively and negatively charged ions that attract each other electrostatically."
  },
  {
    id: 203,
    subjectId: "chemistry",
    chapterId: "chemical-bonding",
    testId: 1,
    questionText: "Which of the following compounds has the highest melting point?",
    options: [
      "NaCl",
      "MgO",
      "KCl",
      "CaO"
    ],
    correctOptionIndex: 1,
    selectedOptionIndex: null,
    explanation: "MgO has the highest melting point among the given compounds due to the high charge density of both Mg²⁺ and O²⁻ ions, resulting in stronger ionic bonds. The melting points decrease in the order: MgO > CaO > NaCl > KCl."
  },
  {
    id: 204,
    subjectId: "chemistry",
    chapterId: "chemical-bonding",
    testId: 1,
    questionText: "Which hybrid orbital is used by carbon in ethene (C₂H₄)?",
    options: [
      "sp",
      "sp²",
      "sp³",
      "sp³d"
    ],
    correctOptionIndex: 1,
    selectedOptionIndex: null,
    explanation: "In ethene (C₂H₄), each carbon atom uses sp² hybridization. This creates three sp² hybrid orbitals that lie in a plane at 120° angles, with one unhybridized p orbital perpendicular to this plane, which forms the π bond in the double bond."
  },
  {
    id: 205,
    subjectId: "chemistry",
    chapterId: "chemical-bonding",
    testId: 1,
    questionText: "What is the bond order in O₂²⁻ ion?",
    options: [
      "1",
      "1.5",
      "2",
      "2.5"
    ],
    correctOptionIndex: 0,
    selectedOptionIndex: null,
    explanation: "The bond order is calculated as (number of bonding electrons - number of antibonding electrons)/2. For O₂²⁻, the molecular orbital configuration gives 10 electrons: 8 in bonding orbitals and 2 in antibonding orbitals. Bond order = (8-6)/2 = 1."
  }
];
