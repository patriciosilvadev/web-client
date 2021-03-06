import React from "react";
import BadgeOutline from '../badges/BadgeOutline';
import TaskBadge from '../badges/TaskBadge';
import DeleteButton from "../ui/buttons/Delete";
import LinkButton from "../ui/buttons/Link";
import NoResults from "../ui/NoResults";
import UserLink from "../users/Link";
import TaskStatusFormatter from "./TaskStatusFormatter";

export default function TasksTable({ tasks, filter = { project: '', status: '' }, destroy }) {
    return (
        <table>
            <thead>
                <tr>
                    <th style={{ width: '190px' }}>Name</th>
                    <th className='only-desktop'>Description</th>
                    <th style={{ width: '190px' }}>Project</th>
                    <th style={{ width: '12ch' }}>Assignee</th>
                    <th style={{ width: '100px' }}>Status</th>
                    <th>Command</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                {tasks.length === 0 ?
                    <tr>
                        <td colSpan="6"><NoResults /></td>
                    </tr> :
                    tasks
                        .filter(task => task.project_id.toString().includes(filter.project))
                        .filter(task => task.status.includes(filter.status))
                        .map((task) =>
                            <tr key={task.id}>
                                <td><TaskBadge task={task} /></td>
                                <td className='only-desktop truncate' >{task.description}</td>
                                <td><a href={`/projects/${task.project_id}`}>{task.project_name}</a></td>
                                <td  >{task.assignee_uid ?
                                    <UserLink userId={task.assignee_uid}>{task.assignee_full_name}</UserLink> : '(nobody)'}</td>
                                <td><TaskStatusFormatter task={task} /></td>
                                <td>{task.command_short_name ? <BadgeOutline>{task.command_short_name}</BadgeOutline> : '-'}</td>
                                <td className='flex justify-end'>
                                    <LinkButton href={`/tasks/${task.id}/edit`}>Edit</LinkButton>
                                    <DeleteButton onClick={() => destroy(task.id)} />
                                </td>
                            </tr>
                        )}
            </tbody>
        </table>
    )
}
