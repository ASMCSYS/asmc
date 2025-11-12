export const IsMember = ({ onChange, value, title = "Are you ASMC member?", name, index, disabled = false }) => {
    const inputName = `${name}_${index ?? 0}`; // Ensure uniqueness

    return (
        <div className="col-12 p-0">
            <div className="radio-input p-0">
                <label className="fw-semibold mb-2">{title} </label>
                <div className="d-flex gap-4 align-items-center">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name={inputName}
                            id={`${inputName}_yes`}
                            value="Yes"
                            checked={value === "Yes"}
                            onChange={() => onChange("Yes")}
                            disabled={disabled}
                        />
                        <label className="form-check-label" htmlFor={`${inputName}_yes`}>
                            Yes
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name={inputName}
                            id={`${inputName}_no`}
                            value="No"
                            checked={value === "No"}
                            onChange={() => onChange("No")}
                            disabled={disabled}
                        />
                        <label className="form-check-label" htmlFor={`${inputName}_no`}>
                            No
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
