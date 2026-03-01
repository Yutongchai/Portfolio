import React from "react";
import ScrollableCards from "../../../components/ui/ScrollableCards";

export interface Activity {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  highlights?: string[];
  backgroundImage?: string;
}

interface ActivityCardsProps {
  activities: Activity[];
}

const ActivityCards: React.FC<ActivityCardsProps> = ({ activities }) => {
  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .activity-card {
          animation: slideInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .activity-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding: 28px;
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease, box-shadow 0.5s ease;
        }

        .activity-card-inner::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.05) 0%,
            rgba(0,0,0,0.65) 85%
          );
          z-index: 0;
        }

        .activity-card-inner:hover {
          transform: translateY(-10px);
          box-shadow: 0 35px 70px -20px rgba(0, 0, 0, 0.45);
        }

        .activity-card-inner:hover .bg-image {
          transform: scale(1.08);
        }

        .bg-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s ease;
          z-index: -1;
        }

        .card-content {
          position: relative;
          z-index: 1;
          text-align: left;
        }

        .accent-line {
          height: 4px;
          width: 48px;
          background-color: #fcb22f;
          margin-top: 14px;
          border-radius: 999px;
          transition: width 0.4s ease;
        }

        .activity-card-inner:hover .accent-line {
          width: 100%;
        }
      `}</style>

      <ScrollableCards desktopColumns={3} gap={8}>
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="activity-card h-[420px]"
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="activity-card-inner">
              {activity.backgroundImage && (
                <div
                  className="bg-image"
                  style={{ backgroundImage: `url(${activity.backgroundImage})` }}
                />
              )}

              <div className="card-content max-w-[90%]">
                <h3 className="text-2xl font-extrabold text-white leading-tight mb-2">
                  {activity.title}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  {activity.shortDescription}
                </p>
                <div className="accent-line" />
              </div>
            </div>
          </div>
        ))}
      </ScrollableCards>
    </>
  );
};

export default ActivityCards;
