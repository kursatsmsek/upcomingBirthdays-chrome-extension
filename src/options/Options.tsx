import React, { useState, useEffect } from 'react'
import { AiOutlineGithub } from 'react-icons/ai'
import defaultPersonPhoto from '../defaultPersonPhoto.png'
import { BsWhatsapp, BsInstagram, BsFacebook, BsTwitter, BsLinkedin } from 'react-icons/bs'
import { BiImageAdd } from 'react-icons/bi'
import { DatePicker } from 'react-date-time-picker-popup'
import 'react-date-time-picker-popup/dist/index.css'
import { ImBin2 } from 'react-icons/im'
import './Options.css'

const Options = () => {
  const currentYear = new Date().getFullYear();
  const [items, setItems] = useState<IBDayList>();
  const websqlite = require('websqlite');
  var SqlService = new websqlite();

  SqlService.init({
    id: 'BirthdayExtension',
    dbObject: window,
    timeout: 1000
  })

  const [social, setSocial] = useState<SocialList>({})

  const [day, setDay] = useState<Date>(new Date());
  const [name, setName] = useState<String | number | undefined>(undefined);
  const [surname, setSurname] = useState<String | undefined>();
  const [photo, setPhoto] = useState<String | ArrayBuffer | null>();

  const inputFileRef = React.useRef<HTMLInputElement | any>();
  const onFileChangeCapture = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    if (e.target.files !== null) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function() {
        setPhoto(reader.result);
      }
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    console.log(social)
  }, [social])

  const photoAddButton = () => {
    inputFileRef.current.click();
  };

  const submitButton = () => {
    SqlService.query(`INSERT INTO upcomingBirthdays (name, surname, birthday, social, photo) VALUES ('${name}', '${surname}', '${day}', '${JSON.stringify(social)}', '${photo}')`);
    SqlService.select("upcomingBirthdays", "*").then((result : IBDayList) => {
      setItems(sortItems(result));
    }).catch((err : any) => {
      console.log(err);
    });
    setPhoto(undefined);
  }

  SqlService.init({
    id: 'BirthdayExtension',
    dbObject: window,
    timeout: 1000
  })

  useEffect(() => {
    SqlService.query("CREATE TABLE IF NOT EXISTS upcomingBirthdays (name VARCHAR(255) NOT NULL, surname VARCHAR(255) NOT NULL, birthday VARCHAR(255) NOT NULL, social TEXT, photo TEXT)");
    SqlService.select("upcomingBirthdays", "*").then((result : IBDayList) => {
      setItems(sortItems(result));
    }).catch((err : any) => {
      console.log(err);
    });
  }, []);

  const sortItems = (itemList: IBDayList) => {
    const list = itemList;
    for (let i = 0; i < list.length; i++) {
      for (let j = i+1; j < list.length; j++) {
        const iDay = new Date(list[i].birthday);
        const jDay = new Date(list[j].birthday);
        if (daysUntilNext(jDay.getMonth() + 1, jDay.getDate()) < daysUntilNext(iDay.getMonth() + 1, iDay.getDate())) {
          const temp = list[i];
          list[i] = list[j];
          list[j] = temp;
        }
      }
    }
    return list;
  }

  const daysUntilNext = (month : number, day : number) => {
    var tday : any = new Date(), y : number= tday.getFullYear(), next: any = new Date(y, month-1, day);
    tday.setHours(0, 0, 0, 0);
    if(tday>next) next.setFullYear(y+1);
    return Math.round((next-tday)/8.64e7);
  }

  return (
    <div className="optionsContainer">
      <div className="optionsHeader">
        <h1>Upcoming Birthdays</h1>
      </div>
      <div className="optionsContent">
        <div className="optionsItemsDiv">
          <div className="optionsItemsHeader">
            <h2>Birthday List</h2>
          </div>
          <div className="optionsItemsContent">
            {
              [
                items?.map((item : IBDayItem) => {
                  const name = item.name;
                  const surname = item.surname;
                  const social = JSON.parse(item.social.toString());
                  const birthday = new Date(item.birthday);
                  return <div className={daysUntilNext(birthday.getMonth() + 1, birthday.getDate()) === 0 ? "popupCardDivToday" : "popupCardDiv"}>
                      <div className="popupAvatarDiv">
                        <img src={item.photo !== "undefined" ? item.photo : defaultPersonPhoto} alt="" className="optionsImgDiv"/>
                      </div>
                    <div className="popupNameDiv">
                      <div className="popupName">
                        {item.name} {item.surname}
                      </div>
                      <div className="popupAccounts">
                        {
                          social.whatsapp ? <BsWhatsapp onClick={() => window.open(`https://wa.me/${social.whatsapp}`,'_blank')} /> : null
                        }
                        {
                          social.instagram ? <BsInstagram onClick={() => window.open(`https://instagram.com/${social.instagram}`,'_blank')} /> : null
                        }
                        {
                          social.twitter ? <BsTwitter onClick={() => window.open(`https://twitter.com/${social.twitter}`,'_blank')} /> : null
                        }
                        {
                          social.facebook ? <BsFacebook onClick={() => window.open(`https://facebook.com/${social.facebook}`,'_blank')} /> : null
                        }
                        {
                          social.linkedin ? <BsLinkedin onClick={() => window.open(`https://linkedin.com/in/${social.linkedin}`,'_blank')} /> : null
                        }
                      </div>
                    </div>
                    <div className="optionsRightDiv">
                      <div className="popupInfoDiv">
                        {
                          daysUntilNext(birthday.getMonth() + 1, birthday.getDate()) === 0 ?
                          "Today !"
                          :
                          `in ${daysUntilNext(birthday.getMonth() + 1, birthday.getDate())} days`
                        }
                      </div>
                      <ImBin2 className="dustBin" onClick={() => {
                        console.log("ds");
                        SqlService.query(`DELETE FROM upcomingBirthdays WHERE name = "${name}" AND surname = "${surname}" AND birthday = "${birthday}"`).then((response : any) => {
                          console.log(response);
                        }).catch((error : any) => {
                          console.log(error);
                        });
                        SqlService.select("upcomingBirthdays", "*").then((result : IBDayList) => {
                          setItems(sortItems(result));
                        }).catch((err : any) => {
                          console.log(err);
                        });
                      }} />
                    </div>
                  </div>
                })
              ]
            }
          </div>
        </div>
        <div className="optionsAddDiv">
          <div className='optionsAddHeader'>
            <h2>Add Person</h2>
          </div>
          <div className="addPersonDivOptions">
            <div className="addPersonInfoOptions">
              <div className="addPersonAddPhoto">
                <input
                  style={{ display: 'none' }}
                  type="file"
                  ref={inputFileRef}
                  onChangeCapture={onFileChangeCapture}
                />
                <BiImageAdd onClick={photoAddButton} />
              </div>
              <div className="addPersonNameInput">
                <div className="addPersonNameDiv">
                  <input placeholder='Name' className="addPersonInput" onChange={(event : React.ChangeEvent<HTMLInputElement> ) : void => {
                    setName(event.target.value);
                  }} />
                </div>
                <br />
                <div className="addPersonSurnameDiv">
                  <input placeholder='Surname' className="addPersonInput" onChange={(event : React.ChangeEvent<HTMLInputElement> ) : void => {
                    setSurname(event.target.value);
                  }} />
                </div>
              </div>
            </div>
            <div className="addPersonCalendarOptions">
              <DatePicker lang="en" selectedDay={day} setSelectedDay={setDay} timeSelector={false} BGColor="#3a8ab9" />
            </div>
            <div className="addPersonSocialOptions">
              <input placeholder="WhatsApp" className="socialInput" onChange={(event : React.ChangeEvent<HTMLInputElement> ) : void => {
                setSocial({...social,
                  whatsapp: event.target.value,
                })
              }} />
              <input placeholder="Instagram" className="socialInput" onChange={(event : React.ChangeEvent<HTMLInputElement> ) : void => {
                setSocial({...social,
                  instagram: event.target.value,
                })
              }} />
              <input placeholder='Twitter' className="socialInput" onChange={(event : React.ChangeEvent<HTMLInputElement> ) : void => {
                setSocial({...social,
                  twitter: event.target.value,
                })
              }} />
              <input placeholder="Linkedin" className="socialInput" onChange={(event : React.ChangeEvent<HTMLInputElement> ) : void => {
                setSocial({...social,
                  linkedin: event.target.value,
                })
              }} />
              <input placeholder="Facebook" className="socialInput" onChange={(event : React.ChangeEvent<HTMLInputElement> ) : void => {
                setSocial({...social,
                  facebook: event.target.value,
                })
              }} />
            </div>
            <div className="addPersonButtons">
              <button className="submitButton" onClick={submitButton}>Submit</button>
            </div>
          </div>
        </div>
      </div>
      <div className="optionsFooter">
        Upcoming Birthdays © { currentYear } | <a href="https://github.com/kursatsmsek/upcomingBirthdays-chrome-extension" target="_blank"><AiOutlineGithub/></a>
      </div>
    </div>
  )
}

export default Options