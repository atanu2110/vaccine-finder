import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));

function Selection() {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [instate, setInState] = useState([]);
    const [district, setDistrict] = useState([]);

    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");

    const [center, setCenter] = useState([]);

    useEffect(() => {
        getAllStates();
    }, []);

    const getAllStates = () => {
        axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/states`)
            .then((response) => {
                setInState(response.data.states);
            })
            .catch(error => console.error(`Error : ${error}`));
    }

    const handleChangeState = (event) => {
        setSelectedState(event.target.value);
        axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/` + event.target.value)
            .then((response) => {
                setDistrict(response.data.districts);
            })
            .catch(error => console.error(`Error : ${error}`));

    }

    const handleChangeDistrict = (event) => {
        setSelectedDistrict(event.target.value);
        var today = new Date();
        var dd = today.getDate();    
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10) 
        {
            dd='0'+dd;
        }       
        if(mm<10) 
        {
            mm='0'+mm;
        }
        today = dd+'-'+mm+'-'+yyyy;
        axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=` + event.target.value
            + `&date=`+today)
            .then((response) => {
                setCenter(response.data.sessions);
            })
            .catch(error => console.error(`Error : ${error}`));
    }
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton> */}
                    <Typography variant="h6" color="inherit">
                        Vaccine Finder - CoWIN
            </Typography>
                </Toolbar>
            </AppBar>

            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">State</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedState}
                    onChange={handleChangeState}
                >
                    {instate.map((state) => (
                        <MenuItem
                            value={state.state_id}
                            key={state.state_name}
                        >
                            {state.state_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">District</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedDistrict}
                    onChange={handleChangeDistrict}
                >
                    {district.map((d) => (
                        <MenuItem
                            value={d.district_id}
                            key={d.district_name}
                        >
                            {d.district_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Grid container spacing={1}>
              
               
                {center.map((centerData) => (

            <Grid container item xs={6} sm={3}>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                {centerData.district_name} - {centerData.block_name}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {centerData.name}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                {centerData.pincode}
                            </Typography>
                            <Typography variant="body2" component="p">
                                <b>Date : </b>  {centerData.date}
                                <br />
                                <b>Fee Type :</b> {centerData.fee_type}
                                <br />
                                <b>Available Capacity :</b>  {centerData.available_capacity}
                                <br />
                                <b>Minimum Age Limit :</b>  {centerData.min_age_limit}
                                <br />
                                <b>Available Vaccine :</b>  {centerData.vaccine}
                                <br />
                                <b>Available Slots :</b>  {centerData.slots}
                                <br />
                            </Typography>
                        </CardContent>
                    </Card>
                    </Grid>
                ))}
           
             

            </Grid>


           


        </div>
    );
}

export default Selection;