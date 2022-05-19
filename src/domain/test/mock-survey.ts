import { SurveyModel } from '../models'
import { AddSurveyParams } from '../usecases'

export const mockSurveyModel = (n: number = 0): SurveyModel => ({
  id: 'any_id',
  question: `question ${n + 1}`,
  answers: [
    { image: 'imagea.png', answer: 'answer A' },
    { image: 'imageb.png', answer: 'answer B' },
    { image: 'imagec.png', answer: 'answer C' }
  ],
  date: new Date('2022-1-1')
})

export const mockSurveyModelArray = (n: number = 3): SurveyModel[] => [...Array(n)].map((_, i) => mockSurveyModel(i))

export const mockSurveyParams = (): AddSurveyParams => ({
  question: 'question 1',
  answers: [
    { image: 'imagea.png', answer: 'answer A' },
    { image: 'imageb.png', answer: 'answer B' },
    { image: 'imagec.png', answer: 'answer C' }
  ],
  date: new Date('2022-1-1')
})
