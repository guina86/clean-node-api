export const surveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultAnswer'
      }
    },
    date: {
      type: 'string'
    },
    isCurrentAccountAnswer: {
      type: 'boolean'
    }

  },
  required: ['surveyId', 'question', 'answers', 'date', 'isCurrentAccountAnswer']
}
