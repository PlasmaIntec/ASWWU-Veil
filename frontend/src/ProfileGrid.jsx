import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Profile from "./Profile.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
	flexGrow: 1,
	padding: '1rem'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function ProfileGrid(props) {
	const classes = useStyles();
	const profiles = props.profiles;

	return (
		<div className={classes.root}>
			<Grid container spacing={3}>
				{
					profiles.map((profile) => (
						<Grid item xs={4} key={profile.username}>
							<Profile className={classes.paper} profile={profile} />
						</Grid>
					))
				}
			</Grid>
		</div>
	);
}
