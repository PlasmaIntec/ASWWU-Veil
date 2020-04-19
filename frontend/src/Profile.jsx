import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import SentimentSatisfiedAltTwoToneIcon from '@material-ui/icons/SentimentSatisfiedAltTwoTone';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';

import { createRelationship, getRelationships, deleteRelationships } from "./neo4jApi";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ff6659',
      main: '#d32f2f',
      dark: '#9a0007',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#6ff9ff',
      main: '#26c6da',
      dark: '#0095a8',
      contrastText: '#000000',
	}
  },
});

const useStyles = makeStyles({
	root: {
		maxWidth: 345,
	},
	media: {
		height: 400
	},
	actions: {
		flexGrow: 1,
		justifyContent: 'space-around'
	}
});

export default function MediaCard(props) {
	const classes = useStyles();
	const username = props.profile.username;
	const url = props.profile.url;

	const [relationships, setRelationships] = useState(new Set())

	const yourUsername = "" // replace with your profile name

	const updateRelationships = () => {
		var isMounted = true; // https://www.debuggr.io/react-update-unmounted-component/
		getRelationships(yourUsername, username)
			.then((newRelationships) => {
				if (isMounted) {
					setRelationships(newRelationships)
				}
			})
		return () => isMounted = false;
	}

	const clickButton = (disposition) => {
		if (relationships.has(disposition.toUpperCase())) {
			deleteRelationships(yourUsername, disposition, username)
				.then(updateRelationships)
			console.log(`YOU UN${disposition} ${username}!`)
		} else {
			createRelationship(yourUsername, disposition, username)
				.then(updateRelationships)
			console.log(`YOU ${disposition} ${username}!`)
		}
	}

	useEffect(updateRelationships)
  
	return (
		<ThemeProvider theme={theme} >
			<Card className={classes.root}>
				<CardActionArea>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
					{username}
					</Typography>
				</CardContent>
				<CardMedia
					className={classes.media}
					image={url}
					title={username}
				/>
				</CardActionArea>
				<CardActions className={classes.actions}>
				<Button size="large" color="primary" onClick={() => clickButton("like")}>
					{
						relationships.has("LIKE") ? 
						<FavoriteIcon /> :
						<FavoriteBorderIcon />
					}
				</Button>
				<Button size="large" style={{ color: yellow[500] }} onClick={() => clickButton("superlike")}>
					{
						relationships.has("SUPERLIKE") ? 
						<StarIcon /> :
						<StarBorderIcon />
					}
				</Button>
				<Button size="large" color="secondary" onClick={() => clickButton("smile")}>
					{
						relationships.has("SMILE") ? 
						<SentimentSatisfiedAltTwoToneIcon /> :
						<SentimentSatisfiedAltIcon />
					}
				</Button>
				</CardActions>
			</Card>
		</ThemeProvider>
	);
}