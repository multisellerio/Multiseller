import * as React from 'React';
import { Avatar, Button } from 'antd';

export interface IAccountDetails {
    onEdit?: React.FormEventHandler<any>;
}

export const AccountDetails: React.StatelessComponent<IAccountDetails> = (details: IAccountDetails) => {
    return <div>
        <div className="row">
            <div className="col-md-12 margin-bottom-1x">
                <div>
                    <Avatar shape="square" icon="user" size={"large"} className={"align-middle"} /> &nbsp;
                </div>
            </div>
            <div className="col-md-6">
                <p>Username: &#9;<b>Sajith Lakjaya</b></p>
            </div>
            <div className="col-md-6">
                <p>Email: &#9;<b>slakjaya@gmail.com</b></p>
            </div>
            <div className="col-md-6">
                <p>First Name: &#9;<b>Sajith Lakjaya</b></p>
            </div>
            <div className="col-md-6">
                <p>Last Name: &#9;<b>Sajith Lakjaya</b></p>
            </div>
            <div className="col-md-12">
                <Button type={"primary"} onClick={details.onEdit}>Edit Profile</Button>
            </div>
        </div>
    </div>;
}