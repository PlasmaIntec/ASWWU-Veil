import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';

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

	const clickButton = (disposition) => {
		console.log(`YOU ${disposition} ${username}!`)
	}
  
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
					<FavoriteBorderIcon />
				</Button>
				<Button size="large" style={{ color: yellow[500] }} onClick={() => clickButton("superlike")}>
					<StarBorderIcon />
				</Button>
				<Button size="large" color="secondary" onClick={() => clickButton("smile")}>
					<SentimentSatisfiedAltIcon />
				</Button>
				</CardActions>
			</Card>
		</ThemeProvider>
	);
}