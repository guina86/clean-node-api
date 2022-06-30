import { SurveyModel } from '@domain/models'
import { AddSurveyParams } from '@domain/usecases'

export const mockSurveyParams = (n: number = 0): AddSurveyParams => ({
  question: `question ${n + 1}`,
  answers: [
    { image: 'imagea.png', answer: 'answer A' },
    { image: 'imageb.png', answer: 'answer B' },
    { image: 'imagec.png', answer: 'answer C' }
  ],
  date: new Date('2022-1-1')
})

export const mockSurveyModel = (n: number = 0): SurveyModel => ({ id: 'any_id', ...mockSurveyParams(n) })

export const mockSurveyModelArray = (n: number = 3): SurveyModel[] => [...Array(n)].map((_, i) => mockSurveyModel(i))
export const mockSurveyParamsArray = (n: number = 3): AddSurveyParams[] => [...Array(n)].map((_, i) => mockSurveyParams(i))
