import React, { useState } from 'react';

const AddCountryModal = (props) => {
    
    const [countryName, setCountryName] = useState('');
    const [flag, setFlag] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const close = () => {
        // reset all temporary states -- don't think it's necessary tho cuz states r cleaned after unmount
        setError('');
        setFile(null);
        setFlag(null);
        setCountryName('');

        // close down modal
        props.visibleFn(false);
    }

    const nameValid = () => {
        if(countryName === '') {
            return false;
        }
        // check if name is duplicate of a UN Country
        for(let i = 0; i < props.committeeCountries.length; i++) {
            if(props.committeeCountries[i].name === countryName) {
                return false;
            }
        }
        // check if name is a duplicate of another committee country
        for(let i = 0; i < props.stockCountries.length; i++) {
            if(props.stockCountries[i].name === countryName) {
                return false;
            }
        }
        return true;
    }

    const sizeValid = () => {
        if (!file) return true; // support no image
        let fileSize = ((file.size/1024)/1024).toFixed(4); // file size in MB
        if(fileSize > 2) return false;
        return true;
    }

    const submit = async () => {
        const BLANKB64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        setLoading(true);
        setError('');
        try {
            if(nameValid()) {
                if(sizeValid()) {
                    let flagImageUrl = await props.upload(countryName, file);
                    let country = {
                        name: countryName,
                        country_flag_base: BLANKB64, // for legacy stand-in
                        country_flag_url: flagImageUrl,
                        presence: '',
                        stats_moderated: '0',
                        stats_unmoderated: '0',
                        stats_primary: '0',
                        stats_secondary: '0'
                    }
                    
                    props.submit(country);
                    setCountryName('');
                    setFlag(null);
                    setFile(null);
                    props.visibleFn(false);
                } else {
                    setError('File size is too large (2MB limit)');
                    setLoading(false);
                }
            } else {
                setError('Duplicate or invalid name');
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert("There was an error uploading the custom country's flag image. Please see the console for more details and send an email (found at bottom of the site)")
        }
    }

    async function handleFileUpload(e) {
        let file = e.target.files[0];
        setFile(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFlag(imageUrl);
        } else {
            setFlag(null);
        }
    }

    return (
        <div className='modal-container add-country'>
            <div className='modal'>
                <div className='modal-top'>
                    <div className='modal-top-text'>
                        Add Custom Country
                    </div>
                    <div className='modal-top-action'>
                        <a onClick={close} >Close</a>
                    </div>
                </div>
                <div className='modal-body'>
                    <div className='modal-input-group'>
                        <h4>Country Name</h4>
                        <input type='text' value={countryName} onChange={e=>setCountryName(e.target.value)} />
                    </div>
                    <div className='modal-input-group'>
                        <h4>Upload Flag</h4>
                        <p className='max-size'>
                            Please make sure the flag is under 2 MB in size.
                        </p>
                        <div className='file-upload-bay'>
                            <input type='file' accept="image/png, image/jpeg" id="file" className='file-input' onChange={e=>handleFileUpload(e)} />
                            {(file) ? (
                                <>
                                    <div className='uploaded-file'>
                                        <img src={flag} />
                                    </div>
                                    <div className='file-name'>
                                        {file.name}
                                    </div>
                                </>
                            ) : ''}
                            <label htmlFor="file" className='file-label'>{(file) ? 'Upload Different' : 'Upload Image'}</label>
                        </div>
                    </div>
                    {(error) ? (
                        <div className='custom-modal-error'>
                            {error}
                        </div>
                    ) : ''}
                </div>
                <div className='modal-bottom'>
                    <button onClick={submit} disabled={loading} className='add'>Add</button>
                    <button onClick={close} className='cancel'>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AddCountryModal;

