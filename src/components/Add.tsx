import React, { useState, useEffect} from 'react'
import { DatePicker } from 'react-date-time-picker-popup'
import 'react-date-time-picker-popup/dist/index.css'
import { BiImageAdd } from 'react-icons/bi'

const Add = ({ setIsAddPage, setItems, sortItems } : { setIsAddPage: (b : boolean) => void, setItems: React.Dispatch<React.SetStateAction<IBDayList | undefined>>, sortItems: (items : IBDayList) => React.SetStateAction<IBDayList | undefined>}) => {

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
    setIsAddPage(false);
  }

  return (
    <div className="addPersonDiv">
      <div className="addPersonInfo">
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
      <div className="addPersonCalendar">
        <DatePicker lang="en" selectedDay={day} setSelectedDay={setDay} timeSelector={false} BGColor="#398AB9" />
      </div>
      <div className="addPersonSocial">
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
        <button className="cancelButton" onClick={() => {setIsAddPage(false)}}>Cancel</button>
        <button className="submitButton" onClick={submitButton}>Submit</button>
      </div>
    </div>
  )
}

export default Add