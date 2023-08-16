import { useEffect, useState } from 'react';
import { toCreateStudentInfo, toGetAllStudentsByLoggedUserId, toUpdateStudentInfo } from '../../provider/service';
import { Redirect } from "react-router-dom";
import "./dashboard.css";

const SKILLS = [
    'Python',
    'Java',
    'JavaScript',
    'Ruby',
    'Php',
    'Swift',
    'TypeScript',
    'Kotlin'
];

const DashBoard = () => {
    const [allStudents, onSetStudents] = useState([]);
    const [selectedStudentIndex, onSelectedStudentIndex] = useState(-1);
    const [isAuthenticated, setAuthenticated] = useState(true);
    const [selectedStudentInfo, onChangeStudentInfo] = useState({ name: '', skills: [] });
    const [newSkill, setNewSkill] = useState('Python');
    const [percentage, setPercentage] = useState(0);
    const [filterSkill, setFilterSkill] = useState('Python');



    useEffect(() => {
        if (allStudents.length > 0) {
            onChangeStudentInfo(allStudents[selectedStudentIndex]);
        }
    }, [selectedStudentIndex])

    useEffect(() => {
        toGetStudentList();
    }, [filterSkill])


    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setAuthenticated(userId ? true : false);
        toGetStudentList();
    }, [])

    const toGetStudentList = async () => {
        const userId = localStorage.getItem('userId')
        const result = await toGetAllStudentsByLoggedUserId(userId, filterSkill);
        if (result && result.success) {
            if (result.data) {
                const filterResult = result.data.sort((a, b) => {
                    return a.skills.find((ele) => ele.name === filterSkill).rate + b.skills.find((ele) => ele.name === filterSkill).rate;
                })
                onSetStudents(filterResult);
            }
        } else {
            onSetStudents([]);
        }
    }

    const toBindSelectedSkillPercentage = (skills) => {
        return skills.find((ele) => ele.name === filterSkill)?.rate || 0;
    }

    if (!isAuthenticated) {
        return (
            <Redirect
                to={{
                    pathname: "/login",
                }}
            />
        );
    }

    const onLogOut = () => {
        localStorage.clear();
        setAuthenticated(false);
    }

    const onAddOrUpdateStudent = async () => {
        const userId = localStorage.getItem('userId');
        if (selectedStudentInfo && selectedStudentInfo._id) {
            const req = {
                ...selectedStudentInfo,
            }
            const result = await toUpdateStudentInfo(req, selectedStudentInfo._id);
            if (result && result.success) {
                toGetStudentList();
            }
        } else {
            const req = {
                ...selectedStudentInfo,
                userId: userId
            }
            const result = await toCreateStudentInfo(req);
            if (result && result.success) {
                toGetStudentList();
            }
        }

        onChangeStudentInfo({ name: '', skills: [] });
    }

    const onRemoveSkill = (index) => {
        const skills = selectedStudentInfo.skills;
        skills.splice(index, 1);
        onChangeStudentInfo({
            ...selectedStudentInfo,
            skills
        })

    }

    const onAddSkill = () => {
        if (newSkill && percentage) {
            const skills = selectedStudentInfo.skills;
            skills.push({ name: newSkill, rate: percentage });
            onChangeStudentInfo({
                ...selectedStudentInfo,
                skills: [...skills]
            })

            setNewSkill('Python')
            setPercentage(0);
        }
    }


    return (
        <div className='DashBoard'>
            <div className='Left'>
                <div className='Row HedaerSd VCenter'>
                    <p>Student List</p>

                    <div className='Row VCenter'>
                        <select name="SKILLS" id="SKILLS" onChange={(event) => setFilterSkill(event.target.value)}>
                            {SKILLS.map(skill => (
                                <option style={{ textTransform: "capitalizes" }} value={skill}>{skill}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {allStudents.length > 0 ?
                    <div className='List'>
                        {allStudents.map((student, studentIndex) => (
                            <button onClick={() => onSelectedStudentIndex(studentIndex)} className={`${(selectedStudentIndex === studentIndex) ? 'SelectedStudentCard' : 'StudentCard'}`} key={student._id}>
                                <p style={{ fontSize: 15, textTransform: "capitalize" }}>{student.name}</p>
                                <p style={{ fontSize: 15, textTransform: "capitalize" }}>{toBindSelectedSkillPercentage(student.skills)}%</p>
                            </button>
                        ))}

                    </div>
                    :
                    <div className='List'>
                        <div className='NotFound'><p>Student Not Found</p></div>
                    </div>
                }
            </div>
            <div className='Right'>
                <button onClick={onLogOut} className='Logout'>
                    <p>Logout</p>
                </button>
                <div className='AddStudent Column'>
                    <p style={{ fontSize: 20, fontWeight: "bold" }}>Student Information</p>
                    <input
                        value={selectedStudentInfo.name || ''}
                        onChange={(event) => onChangeStudentInfo({ ...selectedStudentInfo, name: event.target.value })}
                        style={{ textAlign: "center", width: "50%", alignSelf: "center", height: "5%" }} type="text" name="name" id="name" placeholder="Enter Student Name"
                    />
                    <div className='Row Skill'>
                        <div className='Row'>
                            <label for="Add Skill">Skill:</label>
                            <select name="ADD_SKILL" id="ADD_SKILL" onChange={(event) => setNewSkill(event.target.value)}>
                                {SKILLS.map(skill => (
                                    <option
                                        style={{ textTransform: "capitalizes" }} value={skill}>{skill}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='Row'>
                            <label for="percentage">Percentage:</label>
                            <input value={percentage} onChange={(event) => setPercentage(event.target.value <= 100 ? event.target.value : percentage)} type="number" name="percentage" id="percentage" min="1" max="100" />
                        </div>
                        <div>
                            <input onClick={onAddSkill} style={{ width: 100, height: 30 }} type="button" value="Add" />
                        </div>
                    </div>
                    <div className='SkillSet' style={{ marginTop: 100 }}>
                        {selectedStudentInfo.skills?.map((skill, skillIndex) => (
                            <div className='Chip'>
                                <p style={{ fontSize: 10, textTransform: "capitalize" }}>{skill.name}</p>
                                <button onClick={() => onRemoveSkill(skillIndex)}>{'X'}</button>
                            </div>
                        ))}
                    </div>
                    <div >
                        <button
                            onClick={onAddOrUpdateStudent}
                            disabled={!selectedStudentInfo.name || !selectedStudentInfo.skills.length}
                            style={{ height: 50, width: 100, marginTop: 80 }}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default DashBoard;