import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

import { auth } from "@/auth";
import AnswerCard from "@/components/cards/AnswerCard";
import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { EMPTY_ANSWERS, EMPTY_QUESTIONS, EMPTY_TAGS } from "@/constants/states";
import {
  getUser,
  getUserAnswers,
  getUserQuestions,
  getUserStats,
  getUserTopTags,
} from "@/lib/actions/user.action";

const ProfileDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  const loggedInUser = await auth();

  const { success, data: userData, error } = await getUser({ userId: id });
  if (!success || !userData?.user)
    return (
      <div>
        <p>{error?.message}</p>
      </div>
    );

  const {
    _id,
    name,
    username,
    image,
    location = "SanFransico, California",
    portfolio = "http://localhost:3000",
    bio = "Launch your development career with project-based coaching - showcase your skills with practical development experience and land the coding career of your dreams. Check out jsmastery.pro",
    reputation,
    createdAt,
  } = userData!.user;

  const { data: userStats } = await getUserStats({
    userId: id,
  });

  const {
    success: userQuestionsSuccess,
    data: userQuestions,
    error: userQuestionsError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 1,
  });

  const {
    success: userAnswersSuccess,
    data: userAnswers,
    error: userAnswersError,
  } = await getUserAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 1,
  });

  const {
    success: userTopTagsSuccess,
    data: userTopTags,
    error: userTopTagsError,
  } = await getUserTopTags({
    userId: id,
  });

  const { questions, isNext: hasMoreQuestions } = userQuestions || {};
  const { answers, isNext: hasMoreAnswers } = userAnswers || {};
  const { tags } = userTopTags || {};

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] border-[3px] rounded-full border-primary-500 object-cover"
            fallbackClassName="text-6xl font-bolder"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  imageUrl="/icons/link.svg"
                  href={portfolio}
                  title={portfolio}
                />
              )}

              {location && (
                <ProfileLink imageUrl="/icons/location.svg" title={location} />
              )}

              <ProfileLink
                imageUrl="/icons/calendar.svg"
                title={`joined ${dayjs(createdAt).format("MMM YYYY")}`}
              />
            </div>

            {bio && (
              <p className="mt-8 paragraph-regular text-dark400_light800">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === _id && (
            <Link href={ROUTES.PROFILE(_id)}>
              <Button className="btn-secondary paragraph-semibold text-dark300_light900 px-4 py-3 min-w-44 min-h-12 border light-border rounded-2 dark:border-none">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>
      <Stats
        totalQuestions={userStats?.totalQuestions || 0}
        totalAnswers={userStats?.totalAnswers || 0}
        badges={userStats?.badges || { GOLD: 0, SILVER: 0, BRONZE: 0 }}
        reputationPoints={reputation || 0}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="topPosts" className="w-[400p]">
          <TabsList>
            <TabsTrigger value="topPosts">Top Posts</TabsTrigger>
            <TabsTrigger value="answers">Answers</TabsTrigger>
          </TabsList>
          <TabsContent value="topPosts">
            <DataRenderer
              success={userQuestionsSuccess}
              error={userQuestionsError}
              data={questions}
              empty={EMPTY_QUESTIONS}
              render={(questions) => (
                <div className="flex w-full flex-col gap-10">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      showActionBtns={
                        loggedInUser?.user?.id === question.author._id
                      }
                    />
                  ))}
                </div>
              )}
            />

            <Pagination page={page} isNext={hasMoreQuestions || false} />
          </TabsContent>
          <TabsContent value="answers">
            <DataRenderer
              success={userAnswersSuccess}
              error={userAnswersError}
              data={answers}
              empty={EMPTY_ANSWERS}
              render={(answers) => (
                <div className="flex w-full flex-col gap-10">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      showReadMore
                      content={answer.content.slice(0, 300)}
                      showActionBtns={
                        loggedInUser?.user?.id === answer.author._id
                      }
                      containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreAnswers || false} />
          </TabsContent>
        </Tabs>

        <div className="flex-1 flex flex-col min-w-[250px] w-full max-lg:hidden ">
          <h3 className="h3-bold text-dark200_light900">Top Tags</h3>
          <div className="mt-7 flex flex-col gap-4 ">
            <DataRenderer
              success={userTopTagsSuccess}
              error={userTopTagsError}
              data={tags}
              empty={EMPTY_TAGS}
              render={(tags) => (
                <div className="mt-3 flex w-full flex-col gap-4 ">
                  {tags.map((tag) => (
                    <TagCard
                      key={tag._id}
                      _id={tag._id}
                      name={tag.name}
                      questions={tag.questionsCount}
                      showCount
                      compact
                    />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileDetails;
