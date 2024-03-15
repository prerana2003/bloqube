const DynamicCheckboxGroup = (props) => {
    const { label, name, options, readOnly } = props;
    const [addNewCategory, setNewCategory] = useState({
        name: "",
        checked: true,
        state: false,
    });
    const [optionValues, setOptionValues] = useState(options || []);
    useEffect(() => {
        if (options) {
            setOptionValues(options)
        }
    }, [options]);
    const handleAddNewCategory = () => {
        setNewCategory({ ...addNewCategory, state: true });
    };
    return (<>
        <Card>
            <CardHeader
                title={label}
                titleTypographyProps={{ variant: "h5" }}
                action={
                    <Button variant="text" onClick={handleAddNewCategory}>
                        <Typography variant="subtitle1" color="primary">
                            + Add New
                        </Typography>
                    </Button>
                }
            />
            <CardContent>
                <CheckboxGroupField
                    name={name}
                    disabled={readOnly}
                    options={optionValues}
                />
                {addNewCategory.state && (
                    <Box
                        sx={{
                            border: `1px solid ${theme.palette.grey[400]}`,
                            p: 1.5,
                            px: 5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Checkbox
                            checked={addNewCategory.checked}
                            onChange={(e) => {
                                setNewCategory((prevState) => ({
                                    ...prevState,
                                    checked: e.target.value,
                                }));
                            }}
                        />
                        <TextField
                            label="Add Option"
                            size="small"
                            value={addNewCategory.name}
                            onChange={(e) => {
                                setNewCategory((prevState) => ({
                                    ...prevState,
                                    name: e.target.value,
                                }));
                            }}
                        />
                        {/* <Box sx={{ display: "flex", alignItems: "center", columnGap: 2 }}>
                            <IconButton
                                color="secondary"
                                disabled={disableNewUpload}
                                onClick={handleNewDocumentUpload}
                            >
                                <AttachFileOutlinedIcon />
                            </IconButton>
                        </Box> */}
                    </Box>
                )}
            </CardContent>
        </Card>
    </>);
}

export default DynamicCheckboxGroup;