test("PATTERNS.LC_RE test", ->
  lcNarration = '3201020         :LC CHGS REF/ILCLITF140980770/ONWOKEJI'
  lcRef = 'ILCLITF140980770'
  equal(
    PATTERNS.LC_RE.exec(lcNarration)[1], lcRef,
    "LC Narration matches!")
)


test 'PATTERNS.FORMM_RE test', ->
  formMNarration = '3201025         :MF201400662201/FMLC BA20140000861/BTAKWAZIE'
  extractedNarration = 'MF201400662201/FMLC BA20140000861/BTAKWAZIE'
  equal(
    PATTERNS.FORMM_RE.exec(formMNarration)[0], extractedNarration,
    'Form M Narration matches!')


test 'PATTERNS.BILLS_RE test', ->
  billsNarration = '3201010         :COMM BC USD219,482.92/FOBC03592014/AOOSUN'
  extractedNarration = 'FOBC03592014'
  equal(
    PATTERNS.BILLS_RE.exec(billsNarration)[1], extractedNarration,
    'Bills Narration matches!')

test 'PATTERNS.OUT_RE test', ->
  outwardNarraion1 = 'TIREF FCO145827136/FT TO CLEMENTINA AKPAMGBO/-/EEAKOJIE'
  outwardNarraion2 = 'TIREF OTE146563148/FT TO RICOH INTERNATIONAL B V/-/IUMBANI'
  outwardNarraion3 = 'TIREF OTG146239143/FT TO P K O OGUNYEMI/-/EEAKOJIE'

  equal(
    PATTERNS.OUT_RE.exec(outwardNarraion1)[1], 'FCO145827136',
    'Outward FCO Narration matches')

  equal(
    PATTERNS.OUT_RE.exec(outwardNarraion2)[1], 'OTE146563148',
    'Outward OTE Narration matches')

  equal(
    PATTERNS.OUT_RE.exec(outwardNarraion3)[1], 'OTG146239143',
    'Outward FCO Narration matches')

test 'PATTERNS.INW_RE test', ->
  inwardsNarrationUsd = 'TIREF CFC144485114/TF BY HYDRODIVE NIGERIA LIMITED/-/DNUGOMMA'
  inwardsNarrationEur = 'TIREF CFE145409128/TF BY MUTUAL BENEFITS ASSURANCE PLC/-/DNUGOMMA'
  inwardsNarrationGbp = 'TIREF CFG145214125/TF BY DFWP/-/DNUGOMMA'

  equal(
    PATTERNS.INW_RE.exec(inwardsNarrationUsd)[1], 'CFC144485114',
    'Inward CFC Narration matches'
  )

  equal(
    PATTERNS.INW_RE.exec(inwardsNarrationEur)[1], 'CFE145409128',
    'Inward CFE Narration matches'
  )

  equal(
    PATTERNS.INW_RE.exec(inwardsNarrationGbp)[1], 'CFG145214125',
    'Inward CFG Narration matches'
  )


test 'getQueryParam form M narration test', ->
  text = '3201025         :MF20140076871/FMLC BA03220140000977/BTAKWAZIE'
  narr = 'MF20140076871/FMLC BA03220140000977/BTAKWAZIE'

  equal(
    getQueryParam(text), narr,
    'Get correct TI for Form M Narration from ledger Narration field succeeds'
  )

test 'getQueryParam lcRef test', ->
  text = '3201020         :LC CHGS REF/ILCLITF140980770/ONWOKEJI'
  ref = 'ILCLITF140980770'

  equal(
    getQueryParam(text), ref,
    'Get TI ref for LC from ledger Narration field succeeds'
  )

test 'getQueryParam billsRef test', ->
  text = '3201010         :COMM BC USD469,377.98/FOBC04742014/AOOSUN'
  ref = 'FOBC04742014'

  equal(
    getQueryParam(text), ref,
    'Get TI ref for bills from ledger Narration field succeeds'
  )

test 'getQueryParam outwardsRefUsd test', ->
  text = 'TIREF FCO145827136/FT TO CLEMENTINA AKPAMGBO/-/EEAKOJIE'
  ref = 'FCO145827136'

  ok(
    /^FCO/.test(getQueryParam(text)),
    'ensure this test is for the correct outwards trf type - USD'
  )

  equal(
    getQueryParam(text), ref,
    'Get TI ref for outwards trf (USD) from ledger Narration field succeeds'
  )

test 'getQueryParam outwardsRefEur test', ->
  text = 'TIREF OTE146563148/FT TO RICOH INTERNATIONAL B V/-/IUMBANI'
  ref = 'OTE146563148'

  ok(
    /^OTE/.test(getQueryParam(text)),
    'ensure this test is for the correct outwards trf type - EUR'
  )

  equal(
    getQueryParam(text), ref,
    'Get TI ref for outwards trf (EUR) from ledger Narration field succeeds'
  )

test 'getQueryParam outwardsRefGbp test', ->
  text = 'TIREF OTG145829136/FT TO LIVING FAITH/-/EEAKOJIE'
  ref = 'OTG145829136'

  ok(
    /^OTG/.test(getQueryParam(text)),
    'ensure this test is for the correct outwards trf type - GBP'
  )

  equal(
    getQueryParam(text), ref,
    'Get TI ref for outwards trf (GBP) from ledger Narration field succeeds'
  )

test 'getQueryParam inwardsRefUsd test', ->
  text = 'TIREF CFC144485114/TF BY HYDRODIVE NIGERIA LIMITED/-/DNUGOMMA'
  ref = 'CFC144485114'

  ok(
    /^CFC/.test(getQueryParam(text)),
    'ensure this test is for the correct inwards trf type - USD'
  )

  equal(
    getQueryParam(text), ref,
    'Get TI ref for inward trf (USD) from ledger Narration field succeeds'
  )

test 'getQueryParam inwardsRefEur test', ->
  text = 'TIREF CFE145409128/TF BY MUTUAL BENEFITS ASSURANCE PLC/-/DNUGOMMA'
  ref = 'CFE145409128'

  ok(
    /^CFE/.test(getQueryParam(text)),
    'ensure this test is for the correct inwards trf type - EUR'
  )

  equal(
    getQueryParam(text), ref,
    'Get TI ref for inward trf (USD) from ledger Narration field succeeds'
  )

test 'getQueryParam inwardsRefGbp test', ->
  text = 'TIREF CFG145214125/TF BY DFWP/-/DNUGOMMA'
  ref = 'CFG145214125'

  ok(
    /^CFG/.test(getQueryParam(text)),
    'ensure this test is for the correct inwards trf type - GBP'
  )

  equal(
    getQueryParam(text), ref,
    'Get TI ref for inward trf (GBP) from ledger Narration field succeeds'
  )

test 'getQueryParam narrationDoesNotMatch test', ->
  text = '3201020         :SWIFT CHARGES ON MF1343215 USD192234.68'

  equal(
      getQueryParam(text), null,
      'Get correct TI Narration from ledger Narration field fails'
    )
