import TimestampsSection from 'components/ui/TimestampsSection';
import UserLink from 'components/users/Link';
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import secureApiFetch from '../../services/api';
import CvssScore from '../badges/CvssScore';
import RiskBadge from '../badges/RiskBadge';
import Breadcrumb from '../ui/Breadcrumb';
import ButtonGroup from "../ui/buttons/ButtonGroup";
import DeleteButton from '../ui/buttons/Delete';
import EditButton from "../ui/buttons/Edit";
import PrimaryButton from '../ui/buttons/Primary';
import ExternalLink from "../ui/ExternalLink";
import { IconCheck, IconFlag } from '../ui/Icons';
import Loading from '../ui/Loading';
import Tab from "../ui/Tab";
import Tabs from "../ui/Tabs";
import Title from '../ui/Title';
import { actionCompletedToast } from "../ui/toast";
import useDelete from './../../hooks/useDelete';
import useFetch from './../../hooks/useFetch';
import VulnerabilitiesNotesTab from "./NotesTab";
import VulnerabilityStatusBadge from "./StatusBadge";

const VulnerabilityDetails = () => {
    const history = useHistory()
    const { params: { vulnerabilityId } } = useRouteMatch()
    const [vulnerability, updateVulnerability] = useFetch(`/vulnerabilities/${vulnerabilityId}`)
    const deleteVulnerability = useDelete(`/vulnerabilities/`)

    useEffect(() => {
        if (vulnerability) document.title = `Vulnerability ${vulnerability.summary} | Reconmap`;
    }, [vulnerability])

    const handleDelete = async () => {
        const confirmed = await deleteVulnerability(vulnerabilityId);
        if (confirmed)
            history.push('/vulnerabilities')
    }

    const handleStatus = () => {
        const newStatus = vulnerability.status === 'open' ? 'closed' : 'open';
        secureApiFetch(`/vulnerabilities/${vulnerability.id}`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        })
            .then(() => {
                updateVulnerability()
                actionCompletedToast('The task has been updated.');
            })
            .catch(err => console.error(err))
    }

    if (!vulnerability) return <Loading />

    return <div>
        <div className='heading'>
            <Breadcrumb>
                <Link to="/vulnerabilities">Vulnerabilities</Link>
            </Breadcrumb>
            <ButtonGroup>
                <EditButton onClick={(ev) => {
                    ev.preventDefault();
                    history.push(`/vulnerabilities/${vulnerability.id}/edit`)
                }}>Edit</EditButton>
                {vulnerability.status === 'open' &&
                    <PrimaryButton onClick={handleStatus}>
                        <IconCheck /> Mark as closed</PrimaryButton>}
                {vulnerability.status !== 'open' &&
                    <PrimaryButton onClick={handleStatus}>Mark as open</PrimaryButton>}
                <DeleteButton onClick={handleDelete} />
            </ButtonGroup>
        </div>
        <article>
            <Title type='Vulnerability' title={vulnerability.summary} icon={<IconFlag />} />

            <Tabs>
                <Tab name="Details">
                    <div className="flex">
                        <div className='half'>
                            <h4>Description</h4>
                            <ReactMarkdown>{vulnerability.description || "_(empty)_"}</ReactMarkdown>
                            <h4>Details</h4>
                            <dl>
                                <dt>Status</dt>
                                <dd><VulnerabilityStatusBadge status={vulnerability.status} /></dd>

                                <dt>Risk</dt>
                                <dd><RiskBadge risk={vulnerability.risk} /></dd>

                                <dt>Category</dt>
                                <dd>{vulnerability.category_name || '-'}</dd>

                                <dt>CVSS score</dt>
                                <dd><CvssScore score={vulnerability.cvss_score} /></dd>

                                <dt>CVSS vector</dt>
                                <dd><ExternalLink
                                    href={`https://www.first.org/cvss/calculator/3.0#${vulnerability.cvss_vector}`}>{vulnerability.cvss_vector}</ExternalLink>
                                </dd>
                            </dl>
                        </div>

                        <div className="push-right">
                            <h4>Relations</h4>
                            <dl>
                                <dt>Project</dt>
                                <dd>{vulnerability.project_id ?
                                    <a href={`/projects/${vulnerability.project_id}`}>{vulnerability.project_name}</a> : '-'}</dd>

                                <dt>Affected target</dt>
                                <dd>{vulnerability.target_id ? `${vulnerability.target_name} (${vulnerability.target_kind})` : "-"}</dd>

                                <dt>Created by</dt>
                                <dd><UserLink userId={vulnerability.creator_uid}>{vulnerability.creator_full_name}</UserLink></dd>
                            </dl>

                            <TimestampsSection entity={vulnerability} />
                        </div>
                    </div>
                </Tab>
                <Tab name="Notes"><VulnerabilitiesNotesTab vulnerability={vulnerability} /></Tab>
            </Tabs>
        </article>

    </div>
}

export default VulnerabilityDetails
