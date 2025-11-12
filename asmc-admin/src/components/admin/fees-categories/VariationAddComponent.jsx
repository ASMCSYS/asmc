import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import { Add, CloseOutlined, Delete, Edit } from '@mui/icons-material';
import Input from '../../Common/Input';

const VariationAddComponent = ({
    errors,
    values: formikValues,
    setFieldValue,
    disabled,
}) => {
    const [open, setOpen] = useState(false);
    const [variationName, setVariationName] = useState('');
    const [values, setValues] = useState([]);
    const [currentValue, setCurrentValue] = useState('');
    const [variations, setVariations] = useState(formikValues?.variations || []);
    const [editingIndex, setEditingIndex] = useState(-1);

    // Open/Close Modal
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setVariationName('');
        setValues([]);
        setEditingIndex(-1);
    };

    // Add value to the current variation
    const handleAddValue = () => {
        if (currentValue && !values.includes(currentValue)) {
            setValues([...values, currentValue]);
            setCurrentValue('');
        }
    };

    // Save the variation
    const handleSaveVariation = () => {
        const newVariation = {
            name: variationName,
            values: values.map((value) => ({ value, price: 0 })),
        };

        let updatedVariations;
        if (editingIndex >= 0) {
            updatedVariations = [...variations];
            updatedVariations[editingIndex] = newVariation;
        } else {
            updatedVariations = [...variations, newVariation];
        }

        // Update local state
        setVariations(updatedVariations);

        console.log(updatedVariations, 'updatedVariations');
        // Update Formik values
        setFieldValue('variations', updatedVariations);

        handleClose();
    };
    // Edit a variation
    const handleEditVariation = (index) => {
        const variation = variations[index];
        setVariationName(variation.name);
        setValues(variation.values.map((v) => v.value));
        setEditingIndex(index);
        setOpen(true);
    };

    // Delete a variation
    const handleDeleteVariation = (index) => {
        setVariations(variations.filter((_, i) => i !== index));
    };

    // Update price for a value
    const handlePriceChange = (variationIndex, valueIndex, price) => {
        const updatedVariations = [...variations];
        updatedVariations[variationIndex].values[valueIndex].price = price;

        // Update local state
        setVariations(updatedVariations);

        // Update Formik values
        setFieldValue('variations', updatedVariations);
    };

    const handleRemoveValue = (index) => {
        setValues(values.filter((_, i) => i !== index));
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Advanced Fees Structure
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleOpen}
            >
                Add Variation
            </Button>

            {/* Variations Table */}
            {variations.length > 0 && (
                <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Variation Name</TableCell>
                                <TableCell>Values</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {variations.map((variation, variationIndex) =>
                                variation.values.map((value, valueIndex) => (
                                    <TableRow key={`${variationIndex}-${value.value}`}>
                                        {valueIndex === 0 && (
                                            <TableCell rowSpan={variation.values.length}>
                                                {variation.name}
                                            </TableCell>
                                        )}
                                        <TableCell>{value.value}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                name={`variations[${variationIndex}].values[${valueIndex}].price`}
                                                label="Price"
                                                value={value.price}
                                                onChange={(e) =>
                                                    handlePriceChange(
                                                        variationIndex,
                                                        valueIndex,
                                                        e.target.value,
                                                    )
                                                }
                                                error={Boolean(
                                                    errors?.variations?.[variationIndex]
                                                        ?.values?.[valueIndex]?.price,
                                                )}
                                                helperText={
                                                    errors?.variations?.[variationIndex]
                                                        ?.values?.[valueIndex]?.price
                                                }
                                                fullWidth
                                            />
                                        </TableCell>
                                        {valueIndex === 0 && (
                                            <>
                                                <TableCell
                                                    rowSpan={variation.values.length}
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            handleEditVariation(
                                                                variationIndex,
                                                            )
                                                        }
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleDeleteVariation(
                                                                variationIndex,
                                                            )
                                                        }
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                )),
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Modal */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingIndex >= 0 ? 'Edit Variation' : 'Add Variation'}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseOutlined />
                </IconButton>
                <Grid
                    sx={{ display: 'flex' }}
                    container
                    direction={'column'}
                    width={'100%'}
                    height={'100%'}
                >
                    <Grid flex={1} px={2} py={2} overflow={'auto'}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Input
                                    name="variationName"
                                    label="Variation Name"
                                    value={variationName}
                                    onChange={(e) => setVariationName(e.target.value)}
                                    error={Boolean(errors.variationName)}
                                    helperText={errors.variationName}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <Input
                                    name="currentValue"
                                    label="Add Value"
                                    value={currentValue}
                                    onChange={(e) => setCurrentValue(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddValue();
                                        }
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    onClick={handleAddValue}
                                    disabled={!currentValue}
                                >
                                    Add Value
                                </Button>
                            </Grid>
                            {values.length > 0 && (
                                <Grid item xs={12}>
                                    <Typography variant="body2">Values:</Typography>
                                    <Grid container spacing={1} px={1} py={2}>
                                        {values.map((value, index) => (
                                            <Grid
                                                item
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    backgroundColor: '#f5f5f5',
                                                    padding: '8px',
                                                    borderRadius: '4px',
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{ marginRight: 1 }}
                                                >
                                                    {value}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        handleRemoveValue(index)
                                                    }
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleSaveVariation();
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VariationAddComponent;
