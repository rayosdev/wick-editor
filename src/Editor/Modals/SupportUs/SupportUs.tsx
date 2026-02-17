/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Wick Editor.
 *
 * Wick Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Editor.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Fragment, ReactNode } from 'react';
import WickModal from 'Editor/Modals/WickModal/WickModal';
import classNames from 'classnames';

import flashy from '../../../resources/support-us-icons/flashy.png';
import patreonLogoWhite from '../../../resources/support-us-icons/patreon-logo-white.svg';
import githubLogoWhite from '../../../resources/support-us-icons/github-logo-white.svg';
import githubHeart from '../../../resources/support-us-icons/github-heart.svg';
import facebookIcon from '../../../resources/support-us-icons/facebook.svg';
import instagramIcon from '../../../resources/support-us-icons/instagram.svg';
import twitterIcon from '../../../resources/support-us-icons/twitter.svg';
import whiteHeart from '../../../resources/support-us-icons/white-heart.svg';

interface SupportUsProps {
  open: boolean;
  toggle: () => void;
  isMobile?: boolean;
}

interface ProgressData {
  patreonProgress: number;
  patreonGoal: number;
  githubProgress: number;
  githubGoal: number;
}

/**
 * SupportUs modal displays information about supporting Wick Editor.
 * Shows Patreon and GitHub Sponsors options with progress bars and social links.
 */
const SupportUs: React.FC<SupportUsProps> = ({ open, toggle, isMobile }) => {
  const progressData: ProgressData = {
    patreonProgress: 218,
    patreonGoal: 1000,
    githubProgress: 2,
    githubGoal: 10
  };

  const renderMobileModal = (contentDisplay: ReactNode[], footerDisplay: ReactNode[]): JSX.Element => {
    return (
      <WickModal
        open={open}
        toggle={toggle}
        className="support-modal-body-mobile h-auto w-[300px] min-w-[240px] p-5 font-nunito text-white transition-[height,width] duration-500 ease-in-out"
        overlayClassName="support-modal-overlay">
        <div
          id="support-modal-interior-content"
          className="flex h-full w-full flex-col"
        >
          <div
            id="support-modal-title-mobile"
            className="mb-2 flex w-full flex-row items-center text-left font-bold text-editor-modal-text"
          >
            <img
              id="support-modal-title-img-mobile"
              src={whiteHeart}
              alt="white heart icon"
              className="mr-[10px] inline-block h-auto w-6"
            />
            <p id="support-modal-title-text" className="mb-0 text-[24px]">
              Support Us!
            </p>
          </div>
          {contentDisplay}
        </div>
        {footerDisplay}
      </WickModal>
    );
  };

  const renderDesktopModal = (contentDisplay: ReactNode[], footerDisplay: ReactNode[]): JSX.Element => {
    return (
      <WickModal
        open={open}
        toggle={toggle}
        className="support-modal-body h-auto w-[568px] min-w-[240px] p-5 font-nunito text-white transition-[height,width] duration-500 ease-in-out"
        overlayClassName="support-modal-overlay">
        <div
          id="support-modal-interior-content"
          className="flex h-full w-full flex-col"
        >
          <div
            id="support-modal-title"
            className="mb-4 flex w-full flex-row items-center text-left font-bold text-editor-modal-text"
          >
            <img
              id="support-modal-title-img"
              alt="Wick Editor ghost flashy"
              src={flashy}
              className="mr-[10px] h-auto w-[42px]"
            />
            <p id="support-modal-title-text" className="mb-0 text-[24px]">
              Wick Editor is supported by you!
            </p>
          </div>

          <p
            id="support-modal-benefit-text"
            className="inline-block text-[18px]"
          >
            Get Merch, get featured, and help Wick Editor Grow!
          </p>

          <div className="support-modal-row flex w-full flex-row flex-wrap">
            {contentDisplay}
          </div>

          {footerDisplay}
        </div>
      </WickModal>
    );
  };

  const contentDisplay: ReactNode[] = [<Fragment key="support-us-fragment-1">
    <div
      key="support-us-patreon-cont"
      className={classNames(
        "support-modal-col flex basis-full flex-1 flex-col rounded-[5px] bg-[#525252] pb-1",
        isMobile ? "" : "left-col mr-2 mb-4"
      )}
    >
      <div className="support-modal-col-title mt-2 ml-[5%] flex flex-row items-center">
        <img
          src={patreonLogoWhite}
          alt="white patreon logo"
          className="support-modal-col-title-img h-auto w-5"
        />
        <p className="support-modal-col-title-text ml-[5px] mb-0 text-[16px] font-bold">
          Patreon
        </p>
      </div>
      <p className="support-modal-col-text mr-2 ml-[5%] my-2">
        for individuals and creators
      </p>
      <div className="support-modal-progress-bar mx-auto w-[90%] rounded-[10px] bg-white">
        <div
          className="support-modal-patreon-progress h-[10px] rounded-l-[10px] bg-[#E85B46]"
          style={{ width: `${progressData.patreonProgress / progressData.patreonGoal * 100}%` }}
        />
      </div>
      <p className="support-modal-col-text mr-2 ml-[5%] my-2">
        {`Goal: $${progressData.patreonProgress} / $${progressData.patreonGoal} per month`}
      </p>
      <button
        className="support-modal-button patreon-button mx-auto mb-[0.8em] block w-[80%] rounded-[30px] border-none bg-[#E85B46] p-[5px] text-[18px] font-bold text-white"
        onClick={() => { window.open("https://www.patreon.com/WickEditor", "_blank") }}
      >
        <img
          src={patreonLogoWhite}
          alt="white patreon logo"
          className="support-modal-button-img inline-block h-auto w-[18px]"
        />
        <p className="support-modal-button-text mb-0 ml-[5px] inline-block">
          Become a Patron
        </p>
      </button>
    </div>

    <div
      key="support-us-github-cont"
      className={classNames(
        "support-modal-col flex basis-full flex-1 flex-col rounded-[5px] bg-[#525252] pb-1 mb-4",
        isMobile ? "" : "right-col ml-2"
      )}
    >
      <div className="support-modal-col-title mt-2 ml-[5%] flex flex-row items-center">
        <img
          src={githubLogoWhite}
          alt="white github log"
          className="support-modal-col-title-img h-auto w-5"
        />
        <p className="support-modal-col-title-text ml-[5px] mb-0 text-[16px] font-bold">
          GitHub Sponsors
        </p>
      </div>
      <p className="support-modal-col-text mr-2 ml-[5%] my-2">
        for businesses and developers
      </p>
      <div className="support-modal-progress-bar mx-auto w-[90%] rounded-[10px] bg-white">
        <div
          className="support-modal-github-progress h-[10px] rounded-l-[10px] bg-[#EC6CB9]"
          style={{ width: `${progressData.githubProgress / progressData.githubGoal * 100}%` }}
        />
      </div>
      <p className="support-modal-col-text mr-2 ml-[5%] my-2">
        {`Goal: ${progressData.githubProgress} of ${progressData.githubGoal} sponsors found`}
      </p>
      <button
        className="support-modal-button github-button mx-auto mb-[0.8em] block w-[60%] rounded-[30px] border-none bg-white p-[5px] text-[18px] font-bold text-black"
        onClick={() => { window.open("https://github.com/sponsors/Wicklets", "_blank") }}
      >
        <img
          src={githubHeart}
          alt="pink heart"
          className="support-modal-button-img inline-block h-auto w-[18px]"
        />
        <p className="support-modal-button-text mb-0 ml-[5px] inline-block">
          Sponsor
        </p>
      </button>
    </div>
  </Fragment>];

  const footerDisplay: ReactNode[] = [
    <Fragment key="support-us-fragment-2">
      <p id="support-modal-follow-text" className="mb-0 text-[18px]">
        Follow us and share your work with{' '}
        <span id="support-modal-hashtag" className="inline-block text-wick-green">
          #MadeWithWickEditor
        </span>
        !
      </p>

      <div id="support-modal-social-icons" className="mx-auto h-auto">
        <button
          className="support-modal-social-icon inline-block border-none bg-transparent"
          onClick={() => { window.open("https://www.facebook.com/wickeditor/", "_blank") }}
        >
          <img
            className="support-modal-social-img inline-block h-auto w-10"
            src={facebookIcon}
            alt="facebook logo"
          />
        </button>
        <button
          className="support-modal-social-icon inline-block border-none bg-transparent"
          onClick={() => { window.open("https://www.instagram.com/wickeditor/", "_blank") }}
        >
          <img
            className="support-modal-social-img inline-block h-auto w-10"
            src={instagramIcon}
            alt="instagram logo"
          />
        </button>
        <button
          className="support-modal-social-icon inline-block border-none bg-transparent"
          onClick={() => { window.open("https://twitter.com/wickeditor", "_blank") }}
        >
          <img
            className="support-modal-social-img inline-block h-auto w-10"
            src={twitterIcon}
            alt="twitter logo"
          />
        </button>
      </div>
    </Fragment>];

  if (isMobile) {
    return renderMobileModal(contentDisplay, footerDisplay);
  } else {
    return renderDesktopModal(contentDisplay, footerDisplay);
  }
};

export default SupportUs;
