import { Card, Table } from "react-bootstrap";

export const Summary = ({ selectedCategory, formData, calculateTotalAmount, quantity }) => {
    return (
        <Card className="mt-4 p-3 shadow">
            <h5 className="mb-3">
                <strong>Summary</strong>
            </h5>
            <Table striped bordered hover>
                <tbody>
                    <tr>
                        <td>
                            <strong>Selected Category:</strong>
                        </td>
                        <td>{selectedCategory.category_name}</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Age Group:</strong>
                        </td>
                        <td>
                            {selectedCategory.start_age} - {selectedCategory.end_age}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Gender:</strong>
                        </td>
                        <td>{selectedCategory.gender.join(", ")}</td>
                    </tr>
                    {selectedCategory.distance && (
                        <tr>
                            <td>
                                <strong>Distance:</strong>
                            </td>
                            <td>{selectedCategory.distance} meters</td>
                        </tr>
                    )}
                    <tr>
                        <td>
                            <strong>Quantity:</strong>
                        </td>
                        <td>{quantity} person(s)</td>
                    </tr>
                    <tr className="table-success">
                        <td>
                            <strong>Total Amount to Pay:</strong>
                        </td>
                        <td>
                            <strong>₹{calculateTotalAmount()}</strong>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Card>
    );
};
