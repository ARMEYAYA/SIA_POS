import Topbar from '../../Topbar'
import Sidebar from '../Sidebar'
import React, { useState} from "react"
import back from '../Assets/back.png'
import './SystemPreferences.css'
import edit from '../Assets/edit.png'
import sizechart from '../Assets/sizechart.jpg'
import { useNavigate } from "react-router-dom";

const SystemPreferences = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState(["OOTD", "Daily wear", "Dresses", "Sleep wear"]);

    const [setList, setSetList] = useState(["Set A", "Set B", "Set C", "Set D", "Set E"]);

    const [sizeList, setSizeList] = useState(["80", "90", "100", "110", "120", "130", "140", "150", "160", "170"]);

    const [sizeChartName, setSizeChartName] = useState("sizechart.png");
    const [sizeChartUrl, setSizeChartUrl] = useState(sizechart);
    const [showImage, setShowImage] = useState(false);

    const [isCategoryEditing, setIsCategoryEditing] = useState(false);
    const [isSetEditing, setIsSetEditing] = useState(false);
    const [isSizeEditing, setIsSizeEditing] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [newSet, setNewSet] = useState("");
    const [newSize, setNewSize] = useState("");

    const handleSizeChartChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSizeChartUrl(imageUrl);
            setSizeChartName(file.name);
            setShowImage(false);
        }
    };

    const handleEditSave = (listType) => {
        if (listType === "category") {
            let updated = [...category];
            if (newCategory.trim() !== "") updated.push(newCategory);
            updated = updated.filter(item => item.trim() !== "");
            setCategory(updated);
            setNewCategory("");
            setIsCategoryEditing(!isCategoryEditing);
        }

        if (listType === "set") {
            let updated = [...setList];
            if (newSet.trim() !== "") updated.push(newSet);
            updated = updated.filter(item => item.trim() !== "");
            setSetList(updated);
            setNewSet("");
            setIsSetEditing(!isSetEditing);
        }

        if (listType === "size") {
            let updated = [...sizeList];
            if (newSize.trim() !== "") updated.push(newSize);
            updated = updated.filter(item => item.trim() !== "");
            setSizeList(updated);
            setNewSize("");
            setIsSizeEditing(!isSizeEditing);
        }
    };

    const handleChangeCategory = (index, value) => {
        const updated = [...category];
        updated[index] = value;
        setCategory(updated);
    };

    const handleChangeSet = (index, value) => {
        const updated = [...setList];
        updated[index] = value;
        setSetList(updated);
    };

    const handleChangeSize = (index, value) => {
        const updated = [...sizeList];
        updated[index] = value;
        setSizeList(updated);
    };


    return (
        <div className='system-container'>
            <Sidebar />
            <div className='store-information'>
                <Topbar />

                <div className='system-content'>
                    <div className='settings-sidebar'>
                        <div className='settings-header'>
                            <button><img src={back} className='back' alt='back' onClick={() => navigate("/dashboard")} /></button>
                            <p>Settings</p>
                        </div>
                        <div className='settings-nav'>
                            <ul>
                                <li onClick={() => navigate("/storeinformation")}>Store Information</li>
                                <li onClick={() => navigate("/logreports")}>Log Reports</li>
                                <li className='info'>System Preferences</li>
                            </ul>
                        </div>
                    </div>

                    <div className='systempreferences-container'>
                        <div className='spreferences-header'>
                            <h2>System Preferences</h2>
                        </div>

                        <div className='spreferences-main'>
                            <div className='language-time-con'>
                                <div className='language-con'>
                                    <h4>Language:</h4>
                                    <p>ENGLISH</p>
                                </div>
                                <div className='timezone'>
                                    <h4>Timezone:</h4>
                                    <p>ASIAN/Manila (GMT +8:00)</p>
                                </div>
                            </div>

                            <div className='category-list'>
                                <div className='category-header'>
                                    <h3>Category List</h3>
                                </div>
                                <div className='category-top'>
                                    <p>Default Category</p>
                                    <button onClick={() => handleEditSave("category")}>
                                        {isCategoryEditing ? "Save" : <><img src={edit} alt='edit' />Edit</>}
                                    </button>
                                </div>
                                <div className='category-items'>
                                    <ul>
                                        {category.map((item, index) => (
                                            <li key={index}>
                                                {isCategoryEditing ? (
                                                    <input value={item} onChange={(e) => handleChangeCategory(index, e.target.value)}/>
                                                ) : (
                                                    item
                                                )}
                                            </li>
                                        ))}
                                        {isCategoryEditing && (
                                            <div className='add-category'>
                                                <input type="text" placeholder="Add new category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                                            </div>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className='size-list'>
                                <div className='size-header'>
                                    <h3>Size List</h3>
                                    <button onClick={() => handleEditSave("size")}>
                                        {isSizeEditing ? "Save" : <><img src={edit} alt='edit' />Edit</>}
                                    </button>
                                </div>
                                <div className='size-top'>
                                    <h5>Size Chart:</h5>
                                    <div className="size-chart-edit">
                                        {showImage ? (

                                            <img src={sizeChartUrl} alt="Size Chart" className="size-chart-preview" onClick={() => setShowImage(false)} />
                                        ) : (
                                            <span onClick={() => setShowImage(true)}> {sizeChartName} </span>
                                        )}
                                        {isSizeEditing && (
                                            <>
                                                <button onClick={() => document.getElementById("fileInput").click()}>
                                                    Change
                                                </button>
                                                <input id="fileInput" type="file" style={{ display: "none" }} onChange={handleSizeChartChange} />
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className='default-size'>
                                    <div className='default-head'>
                                        <p>Default Size</p>
                                    </div>
                                    <div className='default-items'>
                                        <ul>
                                            {sizeList.map((item, index) => (
                                                <li key={index}>
                                                    {isSizeEditing ? (
                                                        <input value={item} onChange={(e) => handleChangeSize(index, e.target.value)} />
                                                    ) : (
                                                        item
                                                    )}
                                                </li>
                                            ))}
                                            {isSizeEditing && (
                                                <div className='add-size'>
                                                    <input type="text" placeholder="Add size" value={newSize} onChange={(e) => setNewSize(e.target.value)} />
                                                </div>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className='set-list'>
                                <div className='set-header'>
                                    <h3>Set</h3>
                                    <button onClick={() => handleEditSave("set")}>
                                        {isSetEditing ? "Save" : <><img src={edit} alt='edit' />Edit</>}
                                    </button>
                                </div>
                                <div className='set-con'>
                                    <div className='set-head'>
                                        <p>Default Size</p>
                                    </div>
                                    <div className='set-items'>
                                        <ul>
                                            {setList.map((item, index) => (
                                                <li key={index}>
                                                    {isSetEditing ? (
                                                        <input value={item} onChange={(e) => handleChangeSet(index, e.target.value)} />
                                                    ) : (
                                                        item
                                                    )}
                                                </li>
                                            ))}
                                            {isSetEditing && (
                                                <li className='add-category'>
                                                    <input type="text" placeholder="Add Set" value={newSet} onChange={(e) => setNewSet(e.target.value)}
                                                    />
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemPreferences
