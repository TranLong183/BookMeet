import React from 'react';
import { useState, useEffect } from 'react';
import './Addevent.css';
import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';

const userData = [
    { name: "Mon" },
    { name: "Tue" },
    { name: "Wed" },
    { name: "Thu" },
    { name: "Fri" },
    { name: "Set" },
    { name: "Sun" },
];
function AddEvent() {
    const [sammary, setSammary] = useState('')
    const [email, setEmail] = useState('')
    const [date, setDate] = useState('')
    const [room, setRoom] = useState('')
    const [repeat, setRepeat] = useState('')
    const [users, setUsers] = useState([]);

    const [validationMsg, setValidationMsg] = useState({})

    useEffect(() => {
        setUsers(userData);
    }, []);
    const handleChange = (event) => {
        const { name, checked } = event.target;
        if (name === "allSelect") {
            let tempUser = users.map(user => {
                return { ...user, isChecked: checked };
            });
            setUsers(tempUser);
        } else {
            let tempUser = users.map(user =>
                user.name === name ? { ...user, isChecked: checked } : user
            );
            setUsers(tempUser);
        }
    };
    const onChangeSammary = (event) => {
        const value = event.target.value
        setSammary(value)
    }
    const onChangeEmail = (event) => {
        const value = event.target.value
        setEmail(value)
    }
    const onChangeDate = (event) => {
        const value = event.target.value
        setDate(value)
    }
    const onChangeRoom = (event) => {
        const value = event.target.value
        setRoom(value)
    }
    const onChangeRepeat = (event) => {
        const value = event.target.value
        setRepeat(value)
    }
    const validateAll = () => {
        const msg = {}
        if (isEmpty(sammary)) {
            msg.sammary = "Please input your Sammary!"

        }
        if (isEmpty(email)) {
            msg.email = "Please input your Email!"
        } else if (!isEmail(email)) {
            msg.email = "Your email is incorrect!"
        }
        if (isEmpty(date)) {
            msg.date = "Please input your Date!"

        }
        if (isEmpty(room)) {
            msg.room = "Please select your Room!"
        }
        if (isEmpty(repeat)) {
            msg.repeat = "Please input your Repeat!"
        }
        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }
    const onSubmitLogin = () => {
        const isValid = validateAll()
        if (!isValid) return
    }

    return (
        <div className='wrapper'>
            <div class="title">Add Events</div>
            <div className='content'>
                <form>
                    <div className='user-details'>
                        <div className='input-box1'>
                            <label htmlFor='details1' className='details1'>Summary<span>*</span>:</label>
                            <input
                                type="text"
                                name='sammary'
                                id='details1'
                                placeholder="Title"
                                onChange={onChangeSammary}
                            />
                            <p>{validationMsg.sammary}</p>
                        </div>

                        <div className='input-box1'>
                            <label htmlFor='email' className='details1'>Email</label>
                            <input
                                type="email"
                                name='email'
                                id='email'
                                onChange={onChangeEmail}
                            />
                            <p>{validationMsg.email}</p>
                        </div>
                        <div className='input-box'>
                            <label className='details'>Group:</label>
                            <select class="details3">
                                <option value="1">--None---</option>
                            </select>
                        </div>
                        <div className='input-box'>
                            <label className='details'>Room <span>*</span>:</label>
                            <select class="details3" onChange={onChangeRoom} >
                                <option value="1">--Kiku---</option>
                                <option value="2">a</option>
                                <option value="3">b</option>
                            </select>
                            <p>{validationMsg.room}</p>
                        </div>
                        <div className='input-box2'>
                            <label className='details2'>Start time<span>*</span>:</label>
                            <select class="details3">
                                <option value="1"></option>
                            </select>
                        </div>
                        <div className='input-box2'>
                            <label className='details2'>End time<span>*</span>:</label>
                            <select class="details3">
                                <option value="1"></option>
                            </select>
                        </div>
                        <div className='input-box2'>
                            <label className='details2'>Date<span>*</span>:</label>
                            <input
                                type="date"
                                name="date"
                                onChange={onChangeDate}
                            />
                            <p>{validationMsg.date}</p>
                        </div>
                    </div>
                    <div className='repeat'>
                        <div className='repeat-event' >
                            <label>
                                Repeat Events
                                <input
                                    type="checkbox"
                                    name="repeat"
                                    onChange={onChangeRepeat} />
                            </label>
                        </div>
                        <div className='weekly'>
                            <label className='gender-title'>Weekly:</label>
                            <input
                                type="checkbox"
                                name='allSelect'
                                checked={users.filter(user => user?.isChecked !== true).length < 1}
                                onChange={handleChange}
                            />
                            <label>All</label>
                            {users.map((user) => (
                                <div className='weekly'>
                                    <input
                                        type="checkbox"
                                        name={user.name}
                                        checked={user?.isChecked || false}
                                        onChange={handleChange}
                                    />
                                    <label>{user.name}</label>
                                </div>
                            ))}

                        </div>
                        <p>{validationMsg.repeat}</p>
                        <div className='date'>
                            <div className='input-box'>
                                <label className='details'>From date:</label>
                                <input
                                    type="date"
                                    placeholder='yyyy/mm/dd'
                                />
                            </div>
                            <div className='input-box' id='date2'>
                                <label htmlFor="sDate" className='details'>To Date:</label>
                                <input
                                    type="date"
                                    placeholder='yyyy/mm/dd'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='button'>
                        <button type="button" onClick={onSubmitLogin}> Add </button>
                        <button type="onclose"> Close</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddEvent