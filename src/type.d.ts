type IBDayList = IBDayItem[]

interface IBDayItem {
  name: String;
  surname: String;
  birthday: Date;
  photo: string;
  social: SocialList;
}

interface SocialList {
  whatsapp?: String;
  facebook?: String;
  linkedin?: String;
  twitter?: String;
  instagram?: String;
}
