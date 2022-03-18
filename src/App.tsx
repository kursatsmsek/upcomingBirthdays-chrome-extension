import './App.css';
import { MdOutlineAdd } from 'react-icons/md';
import { BsWhatsapp, BsInstagram, BsFacebook, BsTwitter, BsLinkedin, BsSnapchat } from 'react-icons/bs'
import Add from './components/Add'
import { useState, useEffect } from 'react'
import defaultPersonPhoto from './defaultPersonPhoto.png'
import { ImBin2 } from 'react-icons/im'

function App() {
  const [isAddPage, setIsAddPage] = useState<boolean>(false);
  const [items, setItems] = useState<IBDayList>();
  const websqlite = require('websqlite');
  var SqlService = new websqlite();

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
    console.log("yeni hali", items);
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

  useEffect(() => {
    console.log("items", items);
    items?.map((item) => {
      const a = new Date(item.birthday);
      console.log(a);
    })
  }, [items]);

  const daysUntilNext = (month : number, day : number) => {
    var tday : any = new Date(), y : number= tday.getFullYear(), next: any = new Date(y, month-1, day);
    tday.setHours(0, 0, 0, 0);
    if(tday>next) next.setFullYear(y+1);
    return Math.round((next-tday)/8.64e7);
}

  return (
    <div className="App">
        <div className="popupHeader">
          <div className="popupTitle">
            Upcoming Birthdays
          </div>
          <div className="popupAdd">
            <MdOutlineAdd className="popupAddSvg" onClick={() => {
              setIsAddPage(true);
            }}/>
          </div>
        </div>
        <div className="today">
          {
            isAddPage ?
            <Add setIsAddPage={setIsAddPage} setItems={setItems} sortItems={sortItems}/>
            :
            [
              items?.map((item : IBDayItem) => {
                const social = JSON.parse(item.social.toString());
                const birthday = new Date(item.birthday);
                return <div className={daysUntilNext(birthday.getMonth() + 1, birthday.getDate()) === 0 ? "popupCardDivToday" : "popupCardDiv"}>
                    <div className="popupAvatarDiv">
                    <img src={item.photo !== "undefined" ? item.photo : defaultPersonPhoto} alt="" className="popupAvatar"/>
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
                  <div className="popupAccountsDiv">
                    <div className="popupInfoDiv">
                      {
                        daysUntilNext(birthday.getMonth() + 1, birthday.getDate()) === 0 ?
                        "Today !"
                        :
                        `in ${daysUntilNext(birthday.getMonth() + 1, birthday.getDate())} days`
                      }
                    </div>
                  </div>
                </div>
              })
            ]
          }
        </div>
    </div>
  );
}

export default App;
