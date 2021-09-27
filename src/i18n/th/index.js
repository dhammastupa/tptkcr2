// This is just an example,
// so you can safely delete all default props below

export default {
  system: {
    appName: 'ระบบ​เครือข่ายการอ้างอิง​ร่วมพระไตรปิฎก',
    login: 'เข้าระบบ',
    logout: 'ออกระบบ',
    abbrOrg: 'PTF',
    submit: 'บันทึก',
    submitted: 'บันทึกสำเร็จ',
    success: 'Success',
    error: 'ดำเนินการไม่สำเร็จ โปรดติดต่อเจ้าหน้าที่',
    reset: 'ตั้งค่าใหม่',
    welcome: 'ยินดีต้อนรับ',
    search: 'ค้นหา',
    requiredField: 'โปรดกรอกข้อมูล',
    notValid: 'กรอกข้อมูลไม่ถูกต้อง',
    createdOn: 'สร้างเมื่อ',
    updatedOn: 'ปรับปรุงเมื่อ',
    createdBy: 'สร้างโดย',
    updatedBy: 'ปรับปรุงโดย',
    checkToDelete: 'ต้องการลบรายการ',
    confirm: 'ยืนยัน',
    confirmToDelete: 'คุณแน่ใจว่าต้องการลบข้อมูลรายการนี้',
    cancel: 'ยกเลิก',
    update: 'ปรับปรุง',
    create: 'เพิ่ม',
    delete: 'ลบ',
    deleteRecord: 'ลบรายการ',
    save: 'บันทึก',
    saveRecord: 'บันทึกรายการ',
    note: 'บันทึกหมายเหตุ',
    fontSize: 'ขนาดอักษร',
    close: 'ปิด',
    pali: 'บาลี',
    burmese: 'พม่า',
    devanagari: 'เทวนาครี',
    khmer: 'เขมร',
    lanna: 'ล้านนา',
    laos: 'ลาว',
    roman: 'โรมัน',
    sinhala: 'สิงหล',
    thai: 'ไทย',
    sriLanka: 'ศรีลังกา',
    myanmar: 'พม่า'
  },
  // pageName
  mainNavigation: {
    home: 'หน้าแรก',
    project: 'เกี่ยวกับโครงการ',
    tipitakaPreservation: 'อนุรักษ์พระไตรปิฎก',
    commonReference: 'อ้างอิงร่วม',
    configuration: 'ตั้งค่า',
    tipitakaEdition: 'ฉบับพระไตรปิฎก',
    tocSet: 'ชุดสารบัญ',
    webContent: 'เนื้อหาเว็บไซต์',
    accessControl: 'ระบบควบคุมสิทธิ์',
    user: 'ผู้ใช้งาน',
    group: 'กลุ่ม',
    permission: 'สิทธิ์',
    profile: 'ข้อมูลผู้ใช้'
  },
  pageLogin: {
    pageName: 'เข้าระบบ',
    signIn: 'เข้าระบบ',
    email: 'อีเมล์',
    password: 'รหัสผ่าน',
    forgotPassword: 'ลืมรหัสผ่าน?',
    notValidEmail: 'กรุณาใส่อีเมล์ที่ถูกต้อง',
    atLeast6Char: 'โปรดป้อนอย่างน้อย 6 ตัวอักษร',
    userName: 'ชื่อผู้ใช้'
  },
  pageProfile: {
    firstName: 'ชื่อ',
    lastName: 'นามสกุล',
    group: 'กลุ่ม',
    permission: 'สิทธิ์'
  },
  pageForgotPassword: {
    pageName: 'ลืมรหัสผ่าน',
    email: 'อีเมล์',
    backToLogin: 'กลับสู๋หน้าเข้าระบบ',
    sendEmail: 'ส่งอีเมล์',
    sendPasswordResetEmail: 'ลิงค์เปลี่ยนรหัสผ่านถูกส่งไปยังอีเมลของคุณแล้ว คลิกลิงค์เพื่อสร้างรหัสผ่านใหม่'
  },
  pageTipitakaEdition: {
    code: 'รหัส',
    name: 'ชื่อ',
    yearOfPublication: 'ปีพิมพ์',
    language: 'ภาษา',
    script: 'อักษร',
    volumes: 'จำนวนเล่ม',
    country: 'ประเทศ',
    sequence: 'ลำดับ',
    description: 'รายละเอียด',
    buddhistEra: 'พุทธศักราช',
    publisher: 'ผู้จัดพิมพ์',
    volume: 'เล่ม',
    number: 'หมายเลข',
    totalPages: 'จำนวนหน้า'
  },
  pageTipitakaPreservation: {
    volumesSet: 'เล่ม',
    selectVolume: 'เลือกเล่ม',
    pages: 'หน้า',
    pageNumber: 'หน้าที่',
    text: 'เนื้อความ',
    proofread: 'พิสูจน์อักษร',
    tipitakaEdition: 'ฉบับพระไตรปิฎก',
    image: 'ภาพสแกน',
    volumeNumber: 'เล่มที่',
    removeExtraSpace: 'ลบช่องว่างส่วนเกิน',
    showImage: 'แสดงภาพสแกน',
    showRuler: 'แสดงบรรทัด',
    deleteImage: 'ลบภาพสแกน',
    paddingTop: 'บรรทัดแรก',
    lineSpacing: 'ระหว่างบรรทัด',
    firstLine: 'บรรทัดแรก',
    confirmToCreateWrodlist: 'เมื่อสร้าง "รายการคำ" แล้ว ระบบจะไม่อนุญาตให้แก้ไขข้อความต้นฉบับ',
    confirmToRemoveWrodlist: 'ลบ "รายการคำ" ที่สร้างขึ้นจากหน้านี้ทั้งหมด',
    replceImage: 'เปลี่ยนภาพ',
    uploadImage: 'อัปโหลดไฟล์ภาพ',
    createNewPage: 'สร้างหน้าใหม่หมายเลข',
    allPagesCreated: 'ทำการสร้างครบทุกหน้าแล้ว',
    ruler: 'ไม้บรรทัด',
    dataRepairService: 'ซ่อมแซมข้อมูล',
    createPage: 'เพิ่มหน้า',
    imageScale: 'ขยายภาพ',
    words: 'คำ',
    lineControlPanel: 'จัดการบรรทัด'
  },
  pageCommonToc: {
    createNode: 'สร้าง',
    editNode: 'ปรับปรุง',
    upward: 'เลื่อนขึ้น',
    downward: 'เลื่อนลง',
    changeParent: 'เปลี่ยนกลุ่ม',
    unselectNode: 'ยกเลิกการเลือก',
    deleteNode: 'ลบ',
    openTipitaka: 'เปิดพระไตรปิฎก',
    tipitakaEdtion: 'ฉบับพระไตรปิฎก',
    volume: 'เล่มที่',
    volumes: 'เล่ม',
    page: 'หน้าที่',
    pages: 'หน้า',
    imageScan: 'ภาพสแกน',
    imageWordList: 'รายการคำตามหน้าสแกน',
    tocWordList: 'รายการคำตามสารบัญ',
    noRecordFound: 'ไม่พบข้อมูล',
    wordRange: 'ช่วงเนื้อหา',
    volumeNumber: 'เล่มที่',
    pageNumber: 'หน้าที่',
    noSubcontents: 'ไม่พบสารบัญย่อย',
    topic: 'ชื่อหัวเรื่อง',
    commonReference: 'อ้างอิงร่วม',
    showReference: 'แสดงข้อมูลอ้างอิง',
    addToReference: 'เพิ่มลงข้อมูลอ้างอิง',
    foundReferenceData: 'พบว่ามีข้อมูลอ้างอิง'
  },
  pageTocSet: {
    sequence: 'ลำดับ',
    name: 'ชื่อ',
    description: 'รายละเอียด',
    language: 'ภาษา',
    script: 'อักษร'
  },
  pageWebContent: {
    routeName: 'หน้าเว็บ',
    name: 'ชื่อเรื่อง',
    content: 'เนื้อความ',
    status: 'สถานะ',
    draft: 'ฉบับร่าง',
    published: 'ฉบับเผยแพร่'
  },
  pageAccessControl: {
    email: 'อีเมล',
    firstName: 'ชื่อ',
    lastName: 'นามสกุล'
  },
  failed: 'Action failed',
  success: 'Action was successful'
}
