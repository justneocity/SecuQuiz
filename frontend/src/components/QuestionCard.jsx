import React, { useEffect } from 'react'
import Card from '@mui/material/Card';
import { CardHeader, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  outer: {
    height: '100%',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.3s ease-in-out',
      boxShadow: '0px 4px 8px #94248B',
    },
  },
  inner: {
    position: 'relative',
    margin: 'auto',
    height: '100%',
    borderRadius: '15px !important',
    transition: 'transform 0.3s ease-in-out',
  },
})

export default function QuestionCard ({ question, editQuestionModal }) {
  const classes = useStyles();

  return (
    <div className={classes.outer}>
      <Card className={classes.inner} elevation={3} onClick={() => editQuestionModal(question)}>
        <CardHeader
          title={question.id}
          subheader={question.tags.join(', ')}
        />

        <CardContent>
          <Typography variant="body2" color="black">
            {question.question}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}
