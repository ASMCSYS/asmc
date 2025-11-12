import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const InputBox = ({
    name,
    label,
    type = "text",
    onChange,
    onBlur,
    values,
    errors,
    helperText,
    touched,
    disabled = false,
    prefix = "",
    prefixOptions = null,
    onPrefixChange = () => {},
    ...rest
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
        <div className="input-single">
            <label htmlFor={name}>{label}</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                {prefixOptions ? (
                    <select
                        value={prefix}
                        onChange={(e) => onPrefixChange(e.target.value)}
                        style={{
                            border: "none",
                            background: "#eee",
                            padding: "10px 8px",
                            borderRadius: "0px",
                            fontSize: "0.95rem",
                            height: "100%",
                            width: "50px",
                        }}
                    >
                        {prefixOptions.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                ) : (
                    prefix && (
                        <span
                            style={{
                                position: "absolute",
                                left: "10px",
                                color: "#555",
                                fontSize: "0.95rem",
                                pointerEvents: "none",
                            }}
                        >
                            {prefix}
                        </span>
                    )
                )}

                <input
                    type={type === "password" && showPassword ? "text" : type}
                    name={name}
                    id={name}
                    required=""
                    onChange={onChange}
                    onBlur={onBlur}
                    value={values?.replace(prefix, "")}
                    disabled={disabled}
                    style={{
                        paddingLeft: prefixOptions ? "10px" : prefix ? "35px" : "12px",
                        borderRadius: prefixOptions ? "0 4px 4px 0" : "4px",
                        flex: 1,
                    }}
                    {...rest}
                />

                {type === "password" && (
                    <span
                        onClick={togglePasswordVisibility}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "grey",
                        }}
                    >
                        <FontAwesomeIcon icon={!showPassword ? faEyeSlash : faEye} />
                    </span>
                )}
            </div>
            {errors && <span className="help-block with-errors">{errors}</span>}
            {helperText && (
                <span className="help-block text-muted" style={{ fontSize: "10px" }}>
                    {helperText}
                </span>
            )}
        </div>
    );
};
