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

import flashy from '../../../resources/support-us-icons/flashy.png';
import patreonLogoWhite from '../../../resources/support-us-icons/patreon-logo-white.svg';
import githubLogoWhite from '../../../resources/support-us-icons/github-logo-white.svg';
import githubHeart from '../../../resources/support-us-icons/github-heart.svg';
import facebookIcon from '../../../resources/support-us-icons/facebook.svg';
import instagramIcon from '../../../resources/support-us-icons/instagram.svg';
import twitterIcon from '../../../resources/support-us-icons/twitter.svg';
import whiteHeart from '../../../resources/support-us-icons/white-heart.svg';


import './_supportus.scss';

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
        className="support-modal-body-mobile"
        overlayClassName="support-modal-overlay">
        <div id="support-modal-interior-content">
          <div id="support-modal-title-mobile">
            <img id="support-modal-title-img-mobile" src={whiteHeart} alt="white heart icon" style={{ width: "24px", height: "auto", marginRight: "10px", display: "inline-block" }}></img>
            <p id="support-modal-title-text">Support Us!</p>
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
        className="support-modal-body"
        overlayClassName="support-modal-overlay">
        <div id="support-modal-interior-content">
          <div id="support-modal-title">
            <img id="support-modal-title-img" alt="Wick Editor ghost flashy" src={flashy}></img>
            <p id="support-modal-title-text">Wick Editor is supported by you!</p>
          </div>

          <p id="support-modal-benefit-text">Get Merch, get featured, and help Wick Editor Grow!</p>

          <div className="support-modal-row">
            {contentDisplay}
          </div>

          {footerDisplay}
        </div>
      </WickModal>
    );
  };

  const contentDisplay: ReactNode[] = [<Fragment key="support-us-fragment-1">
    <div key="support-us-patreon-cont" className={isMobile ? "support-modal-col" : "support-modal-col left-col"}>
      <div className="support-modal-col-title">
        <img src={patreonLogoWhite} alt="white patreon logo" className="support-modal-col-title-img"></img>
        <p className="support-modal-col-title-text">Patreon</p>
      </div>
      <p className="support-modal-col-text">for individuals and creators</p>
      <div className="support-modal-progress-bar"><div className="support-modal-patreon-progress" style={{ width: `${progressData.patreonProgress / progressData.patreonGoal * 100}%` }}></div></div>
      <p className="support-modal-col-text">{`Goal: $${progressData.patreonProgress} / $${progressData.patreonGoal} per month`}</p>
      <button className="support-modal-button patreon-button" onClick={() => { window.open("https://www.patreon.com/WickEditor", "_blank") }}>
        <img src={patreonLogoWhite} alt="white patreon logo" className="support-modal-button-img"></img>
        <p className="support-modal-button-text">Become a Patron</p>
      </button>
    </div>

    <div key="support-us-github-cont" className={isMobile ? "support-modal-col" : "support-modal-col right-col"}>
      <div className="support-modal-col-title">
        <img src={githubLogoWhite} alt="white github log" className="support-modal-col-title-img"></img>
        <p className="support-modal-col-title-text">GitHub Sponsors</p>
      </div>
      <p className="support-modal-col-text">for businesses and developers</p>
      <div className="support-modal-progress-bar"><div className="support-modal-github-progress" style={{ width: `${progressData.githubProgress / progressData.githubGoal * 100}%` }}></div></div>
      <p className="support-modal-col-text">{`Goal: ${progressData.githubProgress} of ${progressData.githubGoal} sponsors found`}</p>
      <button className="support-modal-button github-button" onClick={() => { window.open("https://github.com/sponsors/Wicklets", "_blank") }}>
        <img src={githubHeart} alt="pink heart" className="support-modal-button-img"></img>
        <p className="support-modal-button-text">Sponsor</p>
      </button>
    </div>
  </Fragment>];

  const footerDisplay: ReactNode[] = [
    <Fragment key="support-us-fragment-2">
      <p id="support-modal-follow-text">Follow us and share your work with <p id="support-modal-hashtag">#MadeWithWickEditor</p>!</p>

      <div id="support-modal-social-icons">
        <button className="support-modal-social-icon" onClick={() => { window.open("https://www.facebook.com/wickeditor/", "_blank") }}>
          <img className="support-modal-social-img" src={facebookIcon} alt="facebook logo"></img>
        </button>
        <button className="support-modal-social-icon" onClick={() => { window.open("https://www.instagram.com/wickeditor/", "_blank") }}>
          <img className="support-modal-social-img" src={instagramIcon} alt="instagram logo"></img>
        </button>
        <button className="support-modal-social-icon" onClick={() => { window.open("https://twitter.com/wickeditor", "_blank") }}>
          <img className="support-modal-social-img" src={twitterIcon} alt="twitter logo"></img>
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
