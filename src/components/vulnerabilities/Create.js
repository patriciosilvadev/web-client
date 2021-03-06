import React, {useRef, useState} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom';
import Breadcrumb from '../ui/Breadcrumb';
import Risks from '../../models/Risks'
import Title from '../ui/Title';
import {IconPlus} from '../ui/Icons';
import useSetTitle from "../../hooks/useSetTitle";
import VulnerabilityForm from "./Form";
import secureApiFetch from "../../services/api";

const VulnerabilityCreate = () => {

    useSetTitle('Add vulnerability');

    const history = useHistory();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const urlProjectId = useRef(searchParams.get('projectId') || 0);

    const [vulnerability, setVulnerability] = useState({
        project_id: urlProjectId.current,
        summary: "",
        description: "",
        risk: Risks[0].id,
        category_id: 0,
        cvss_score: null,
        cvss_vector: null,
        target_id: 0,
    })

    const onFormSubmit = ev => {
        ev.preventDefault();

        secureApiFetch(`/vulnerabilities`, {method: 'POST', body: JSON.stringify(vulnerability)})
            .then(resp => history.push(`/vulnerabilities`));
    };

    return (
        <div>
            <div className='heading'>
                <Breadcrumb>
                    <Link to="/vulnerabilities">Vulnerabilities</Link>
                </Breadcrumb>
            </div>
            <Title title="New vulnerability details" icon={<IconPlus/>}/>

            <VulnerabilityForm vulnerability={vulnerability} vulnerabilitySetter={setVulnerability}
                               onFormSubmit={onFormSubmit}/>
        </div>
    )
};

export default VulnerabilityCreate;
