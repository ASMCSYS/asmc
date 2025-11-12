import { format, parseISO } from "date-fns";

export const FamilyDetails = ({ values, editDetails, deleteDetails }) => {
    console.log(values, "values");
    return (
        <div className="checkout__box pricing text-align-left position-relative">
            {values?.fees_paid ? (
                <div className="mui-chip position-absolute top-0 right-0 m-2">
                    <span>Paid</span>
                </div>
            ) : (
                <div className="mui-chip position-absolute top-0 right-0 m-2 bg-danger">
                    <span>Unpaid</span>
                </div>
            )}
            <div className="shop__card-info pt-2">
                <p>{values?.id}</p>
                <h4>{values?.name}</h4>
                <p>{values?.dob ? format(new Date(parseISO(values?.dob)), "dd MMM,yyyy") : null}</p>
            </div>
            <div className="pricing__card-body justify-content-start p-0 pt-2 pb-2">
                <ul>
                    <li className="secondary-text">{values?.relation}</li>
                    <li className="secondary-text">{values?.mobile}</li>
                    <li className="secondary-text">
                        {/* <i className="asmc-pin-checked"></i> */}
                        {values?.email}
                    </li>
                    <li className="secondary-text">
                        {/* <i className="asmc-pin-checked"></i> */}
                        {values?.is_dependent ? "Dependent" : "Non-dependent"}
                    </li>
                </ul>
            </div>
            <div className="shop__card-cta">
                <button className="cmn-button cmn-button-small" onClick={editDetails}>
                    Edit
                </button>
                {/* <button className="cmn-button cmn-button--secondary cmn-button-small" onClick={deleteDetails}>Delete</button> */}
            </div>
        </div>
    );
};
