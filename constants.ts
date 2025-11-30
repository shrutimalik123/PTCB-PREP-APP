export const TOP_200_DRUGS = [
  "Atorvastatin", "Levothyroxine", "Lisinopril", "Metformin", "Amlodipine",
  "Metoprolol", "Albuterol", "Omeprazole", "Losartan", "Gabapentin",
  "Hydrochlorothiazide", "Sertraline", "Simvastatin", "Montelukast", "Escitalopram",
  "Acetaminophen/Hydrocodone", "Rosuvastatin", "Bupropion", "Furosemide", "Pantoprazole",
  "Trazodone", "Dextroamphetamine/Amphetamine", "Fluticasone", "Tamsulosin", "Duloxetine",
  "Meloxicam", "Clopidogrel", "Prednisone", "Citalopram", "Insulin Glargine",
  "Potassium Chloride", "Pravastatin", "Tramadol", "Carvedilol", "Venlafaxine",
  "Alprazolam", "Atenolol", "Cyclobenzaprine", "Allopurinol", "Zolpidem",
  "Fluoxetine", "Clonazepam", "Loratadine", "Azithromycin", "Amoxicillin",
  "Glipizide", "Oxycodone", "Gabapentin", "Warfarin", "Estradiol",
  "Ethinyl Estradiol/Norethindrone", "Lamotrigine", "Quetiapine", "Fenofibrate", "Sitagliptin",
  "Diazepam", "Spironolactone", "Amitriptyline", "Lovastatin", "Topiramate",
  "Vyvanse", "Pregabalin", "Budesonide/Formoterol", "Latanoprost", "Ranitidine",
  "Ondansetron", "Naproxen", "Finasteride", "Celecoxib", "Donepezil",
  "Oxycodone/Acetaminophen", "Doxycycline", "Valsartan", "Clindamycin", "Metronidazole",
  "Glimepiride", "Cephalexin", "Sulfamethoxazole/Trimethoprim", "Tizanidine", "Methylphenidate",
  "Sumatriptan", "Hydroxyzine", "Diclofenac", "Insulin Aspart", "Levemir",
  "Baclofen", "Famotidine", "Methotrexate", "Diltiazem", "Mirtazapine",
  "Promethazine", "Nitroglycerin", "Digoxin", "Benazepril", "Ropinirole",
  "Risperidone", "Ibuprofen", "Cetirizine", "Aripiprazole", "Verapamil",
  "Hydralazine", "Memantine", "Nifedipine", "Theophylline", "Clonidine",
  "Dicyclomine", "Buspirone", "Amiodarone", "Meclizine", "Terazosin",
  "Benztropine", "Divalproex", "Varenicline", "Lidocaine", "Nortriptyline",
  "Ezetimibe", "Valacyclovir", "Testosterone", "Mupirocin", "Nystatin",
  "Ciprofloxacin", "Folic Acid", "Glipizide", "Lansoprazole", "Propranolol",
  "Methocarbamol", "Olanzapine", "Tolterodine", "Pioglitazone", "Acyclovir",
  "Hydroxychloroquine", "Glyburide", "Penicillin", "Triamcinolone", "Bumetanide",
  "Cefdinir", "Levofloxacin", "Nitrofurantoin", "Sucralfate", "Mometasone",
  "Sildenafil", "Tadalafil", "Gemfibrozil", "Levetiracetam", "Oseltamivir",
  "Rivaroxaban", "Apixaban", "Dabigatran", "Enoxaparin", "Insulin Lispro",
  "Liraglutide", "Semaglutide", "Empagliflozin", "Canagliflozin", "Ipratropium",
  "Tiotropium", "Budesonide", "Fluticasone/Salmeterol", "Codeine/Guaifenesin", "Benzonatate",
  "Fexofenadine", "Diphenhydramine", "Oxymetazoline", "Pseudoephedrine", "Dextromethorphan",
  "Carbamazepine", "Phenytoin", "Phenobarbital", "Primidone", "Oxcarbazepine",
  "Lithium", "Haloperidol", "Ziprasidone", "Lurasidone", "Eszopiclone",
  "Temazepam", "Ramelteon", "Modafinil", "Armodafinil", "Atomoxetine",
  "Guanfacine", "Prazosin", "Doxazosin", "Bisoprolol", "Nebivolol",
  "Isosorbide Mononitrate", "Ranolazine", "Sotalol", "Flecainide", "Propafenone"
];

// Fisher-Yates shuffle algorithm
export const shuffleDeck = (array: string[]): string[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};